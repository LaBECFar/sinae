package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.ActionMode
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.adapter.FrameAdapter
import br.com.webgenium.sinae.room.AppDao
import br.com.webgenium.sinae.room.AppDatabase
import kotlinx.android.synthetic.main.activity_analise.*
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

class AnaliseActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }

    private var mAdapter = FrameAdapter(mutableListOf())

    private var actionMode: ActionMode? = null
    private val actionModeCallback = ActionModeCallback()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_analise)
        setupRecycler()
    }

    @SuppressLint("SetTextI18n")
    override fun onResume() {
        super.onResume()

        val id: Long = intent.getLongExtra("analiseId", 0)

        lifecycleScope.launch {
            dao.getAnaliseById(id)?.collect {
                txt_titulo.text = it.tempo
                txt_fps.text = "FPS: " + it.fps

                dao.getFramesFromAnalise(id).collect { list ->
                    txt_frames.text = "Frames Extraidos: " + list.size.toString()
                    mAdapter.atualizar(list.toMutableList())
                }
            }
        }
    }


    private fun setupRecycler() {
        val layoutManager = LinearLayoutManager(this)
        layoutManager.orientation = LinearLayoutManager.VERTICAL
        recyclerview.layoutManager = layoutManager

        mAdapter.onItemClick = { img, pos ->
            if (actionMode != null) {
                toggleItemSelection(pos)
            } else {
                abrirFrameActivity(img.frame)
            }
        }

        mAdapter.onItemLongClick = { _, position -> toggleItemSelection(position) }

        recyclerview.adapter = mAdapter
    }


    private fun abrirFrameActivity(imageSrc: String) {
        val intent = Intent(this, FrameActivity::class.java)
        intent.putExtra("imageSrc", imageSrc)
        startActivity(intent)
    }


    private fun checkActionMode() {
        val count = mAdapter.getSelectedItemCount()

        if (count > 0) {
            if (actionMode == null) {
                actionMode = startActionMode(actionModeCallback)
            }
            actionMode?.title = "Frames"
            actionMode?.subtitle = "$count selecionado(s)"
        } else {
            actionMode?.finish()
        }
    }


    private fun toggleItemSelection(position: Int) {
        mAdapter.toggleSelection(position)
        checkActionMode()
    }

    private fun removerItensSelecionados() {
        val revertedSelectedPositions = mAdapter.getSelectedItems().asReversed()

        revertedSelectedPositions.forEach { pos ->
            val analise = mAdapter.getItem(pos)
            mAdapter.removerItem(analise)

            lifecycleScope.launch {
                analise.removerArquivo()
                dao.deleteFrame(analise)
            }
        }
        mAdapter.notifyDataSetChanged()
    }

    private fun confirmarExclusao(){
        val count = mAdapter.getSelectedItemCount()

        var msg = "Deseja excluir $count frame"
        if(count > 1){
            msg += "s"
        }
        msg += "?"

        val builder = AlertDialog.Builder(this)
        builder.setTitle("Excluir Frames")
        builder.setMessage(msg)
        builder.setPositiveButton("Sim") { dialog, which ->
            removerItensSelecionados()
            actionMode?.finish()
        }
        builder.setNegativeButton("Não") { dialog, which -> }
        val dialog: AlertDialog = builder.create()
        dialog.show()
    }

    private inner class ActionModeCallback : ActionMode.Callback {

        override fun onCreateActionMode(mode: ActionMode, menu: Menu): Boolean {
            val inflater: MenuInflater = mode.menuInflater
            inflater.inflate(R.menu.listagem_menu, menu)
            return true
        }

        override fun onPrepareActionMode(mode: ActionMode, menu: Menu): Boolean {
            return false
        }

        override fun onActionItemClicked(mode: ActionMode, item: MenuItem): Boolean {
            return when (item.itemId) {
                R.id.remover_item -> {
                    confirmarExclusao()
                    true
                }
                else -> false
            }
        }

        override fun onDestroyActionMode(mode: ActionMode) {
            mAdapter.clearSelection()
            actionMode = null
        }
    }
}
