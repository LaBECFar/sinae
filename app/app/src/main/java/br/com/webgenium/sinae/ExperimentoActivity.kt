package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.ActionMode
import android.widget.TextView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.custom.adapter.AnaliseAdapter
import br.com.webgenium.sinae.database.*
import kotlinx.android.synthetic.main.activity_experimento.*
import kotlinx.coroutines.launch
import android.view.MenuItem
import android.view.Menu
import android.view.MenuInflater
import androidx.appcompat.app.AlertDialog
import br.com.webgenium.sinae.api.FrameClient
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.model.Experimento


class ExperimentoActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }

    private var experimento: Experimento? = null
    private var mAdapter = AnaliseAdapter(mutableListOf())

    private var actionMode: ActionMode? = null
    private val actionModeCallback = ActionModeCallback()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_experimento)
        setupRecycler()

        btn_nova_analise.setOnClickListener {
            novaAnalise()
        }
    }

    private fun novaAnalise() {
        experimento?.let {
            val intent = Intent(this, NovaAnaliseActivity::class.java)
            intent.putExtra("experimentoCodigo", it.codigo)
            startActivity(intent)
        }
    }


    @SuppressLint("SetTextI18n")
    override fun onResume() {
        super.onResume()

        val cod: String = intent.getStringExtra("experimentoCodigo") ?: ""

        lifecycleScope.launch {
            experimento = dao.getExperimentoByCodigo(cod)

            experimento?.let {
                titulo.text = it.label
                codigo.text = "Código: " + it.codigo

                val analises = dao.getAnalises(cod)
                mAdapter.atualizar(analises.toMutableList())

                if (analises.isNotEmpty()) {
                    txt_analises.visibility = TextView.VISIBLE
                }
            }
        }
    }


    private fun abrirAnaliseActivity(analiseId: Long) {
        val intent = Intent(this, AnaliseActivity::class.java)
        intent.putExtra("analiseId", analiseId)
        startActivity(intent)
    }


    private fun setupRecycler() {
        val layoutManager = LinearLayoutManager(this)
        layoutManager.orientation = LinearLayoutManager.VERTICAL

        mAdapter.onItemClick = { analise, position ->
            if (actionMode != null) {
                toggleItemSelection(position)
            } else {
                abrirAnaliseActivity(analise.id)
            }
        }

        mAdapter.onItemLongClick = { _, position -> toggleItemSelection(position) }

        recyclerview.layoutManager = layoutManager
        recyclerview.adapter = mAdapter
    }


    private fun checkActionMode() {
        val count = mAdapter.getSelectedItemCount()

        if (count > 0) {
            if (actionMode == null) {
                actionMode = startActionMode(actionModeCallback)
            }
            actionMode?.title = "Analises"
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
                val frames = dao.getFramesFromAnalise(analise.id)

                frames.forEach {
                    it.removerArquivo()
                }

                dao.deleteAnalise(analise)
            }
        }
        mAdapter.notifyDataSetChanged()
    }

    private fun confirmarExclusao(){
        val count = mAdapter.getSelectedItemCount()

        var msg = "Deseja excluir $count análise"
        if(count > 1){
            msg += "s"
        }
        msg += "?"

        val builder = AlertDialog.Builder(this)
        builder.setTitle("Excluir Análises")
        builder.setMessage(msg)
        builder.setPositiveButton("Sim") { _, _ ->
            removerItensSelecionados()
            actionMode?.finish()
        }
        builder.setNegativeButton("Não") { _, _ -> }
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
