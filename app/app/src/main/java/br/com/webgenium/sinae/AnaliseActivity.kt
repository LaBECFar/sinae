package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.ActionMode
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.api.FrameClient
import br.com.webgenium.sinae.custom.adapter.FrameAdapter
import br.com.webgenium.sinae.database.AppDao
import br.com.webgenium.sinae.database.AppDatabase
import br.com.webgenium.sinae.model.Analise
import br.com.webgenium.sinae.model.Frame
import kotlinx.android.synthetic.main.activity_analise.*
import kotlinx.coroutines.launch
import java.util.*
import kotlin.concurrent.schedule


class AnaliseActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }

    private var analise: Analise? = null

    private var mAdapter = FrameAdapter(mutableListOf())
    private var menu: Menu? = null

    private var actionMode: ActionMode? = null
    private val actionModeCallback = ActionModeCallback()

    private var isUploading = false
    private var countUploaded: Int = 0


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
            analise = dao.getAnaliseById(id)

            analise?.let {
                txt_titulo.text = it.tempo
                txt_fps.text = "FPS: " + it.fps
                txt_placa.text = "Placa: " + it.placa

                it.frames = dao.getFramesFromAnalise(id).toMutableList()
                mAdapter.atualizar(it.frames)
                txt_frames.text = "Frames: ${framesValue()}"

                toggleRecyclerVisibility(it.frames.isEmpty())
            }

            checkUploadMenu()
        }
    }

    private fun toggleRecyclerVisibility(isVisible: Boolean) {
        if (!isVisible) {
            empty_view.visibility = TextView.GONE
            recyclerview.visibility = TextView.VISIBLE
        } else {
            recyclerview.visibility = TextView.GONE
            empty_view.visibility = TextView.VISIBLE
        }
    }

    private fun framesValue(): String {
        analise?.let {
            if(it.frames.isEmpty()){
                return "0"
            }

            countUploadedFrames()

            if (countUploaded >= it.frames.size) {
                return "$countUploaded / ${it.frames.size} (Upload Completo)"
            }

            if (isUploading) {
                return "$countUploaded / ${it.frames.size} (Enviando...)"
            }

            return "$countUploaded / ${it.frames.size}"
        }
        return "?"
    }

    private fun countUploadedFrames() {
        countUploaded = 0

        analise?.let { analise ->
            analise.frames.forEach {
                if (it.uploaded) {
                    countUploaded++
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
                abrirFrameActivity(img.uri)
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

    private fun pauseUpload() {
        if (isUploading) {
            val item: MenuItem? = menu?.findItem(R.id.upload_frames)
            item?.let {
                item.setIcon(R.drawable.ic_cloud_upload_black_24dp)
            }

            isUploading = false
            txt_frames.text = getString(R.string.contador_frames, framesValue())
        }
    }

    // Método para iniciar o upload dos frames dessa analise
    private fun uploadFrames() {
        if (!isUploading) {
            isUploading = true

            val item: MenuItem? = menu?.findItem(R.id.upload_frames)
            item?.let {
                item.setIcon(R.drawable.ic_pause_white_24dp)
            }

            analise?.let {
                if (it.id > 0 && it.idserver.isNotEmpty()) {
                    uploadNextFrame()
                }
            }
        } else {
            pauseUpload()
        }
    }


    private fun uploadNextFrame() {
        if (isUploading) {

            analise?.let { analise ->
                val context = this

                lifecycleScope.launch {
                    val frame = dao.getFrameFromAnaliseToUpload(analise.id)

                    if (frame != null) {
                        FrameClient(context).uploadFrame(
                            frame = frame,
                            experimentoCodigo = analise.experimentoCodigo,
                            analiseId = analise.idserver,
                            tempoMilis = frame.tempoMilis
                        ) {
                            if (it.uploaded) {
                                val frameLocal: Frame? = analise.getFrameById(frame.id)

                                frameLocal?.let { frameLocal ->
                                    frameLocal.uploaded = true

                                    lifecycleScope.launch {
                                        dao.updateFrame(frameLocal)
                                    }

                                    mAdapter.notifyDataSetChanged()
                                    txt_frames.text =
                                        getString(R.string.contador_frames, framesValue())


                                    Timer("SettingUp", false).schedule(500) {
                                        uploadNextFrame()
                                    }

                                }
                            }
                        }
                    } else {
                        onFramesUploadComplete()
                    }
                }
            }

        }
    }


    private fun onFramesUploadComplete() {
        hideUploadMenu()
        Log.d("SINAE", "Nenhum frame para upload foi encontrado")
    }

    private fun hideUploadMenu() {
        val item: MenuItem? = menu?.findItem(R.id.upload_frames)
        item?.let {
            item.setVisible(false)
        }
    }


    private fun checkUploadMenu() {
        analise?.let {
            lifecycleScope.launch {
                val uploadableFrame = dao.getFrameFromAnaliseToUpload(it.id)
                if (uploadableFrame == null) {
                    hideUploadMenu()
                }
            }

        }
    }


    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        this.menu = menu
        val inflater: MenuInflater = menuInflater
        inflater.inflate(R.menu.menu_analise, menu)

        checkUploadMenu()

        return true
    }


    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.upload_frames -> {
                uploadFrames()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
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

    @SuppressLint("SetTextI18n")
    private fun removerItensSelecionados() {
        val revertedSelectedPositions = mAdapter.getSelectedItems().asReversed()

        revertedSelectedPositions.forEach { pos ->
            val frame = mAdapter.getItem(pos)
            mAdapter.removerItem(frame)

            lifecycleScope.launch {
                frame.removerArquivo()
                dao.deleteFrame(frame)
            }

            mAdapter.notifyDataSetChanged()
            txt_frames.text = getString(R.string.contador_frames, framesValue())
        }
    }

    private fun confirmarExclusao() {
        val count = mAdapter.getSelectedItemCount()

        var msg = "Deseja excluir $count frame"
        if (count > 1) {
            msg += "s"
        }
        msg += " localmente?"

        val builder = AlertDialog.Builder(this)
        builder.setTitle("Excluir Frames")
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
