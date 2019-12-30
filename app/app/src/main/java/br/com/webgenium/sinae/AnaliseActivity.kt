package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.view.ActionMode
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.animation.AnimationUtils
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.api.AnaliseClient
import br.com.webgenium.sinae.api.FrameClient
import br.com.webgenium.sinae.custom.adapter.FrameAdapter
import br.com.webgenium.sinae.custom.toast
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


        sync_warning.setOnClickListener {
            val rotation = AnimationUtils.loadAnimation(this, R.anim.rotate)
            rotation.fillAfter = true
            sync_warning_drawable.startAnimation(rotation)
            sync_warning_txt.text = getString(R.string.syncing_warning_analise)

            saveServer({
                sync_warning_drawable.clearAnimation()
                sync_warning.visibility = TextView.GONE
                showUploadMenu()
            }, {
                sync_warning_drawable.clearAnimation()
                sync_warning_txt.text = getString(R.string.sync_warning_analise)
                sync_warning.visibility = TextView.VISIBLE
            })
        }
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
                txt_placa.text = getString(R.string.board) + ": " + it.placa

                var data = it.dataColeta
                if(data.contains("T")) {
                    data = data.split("T")[0]
                }
                txt_data.text = getString(R.string.collection_date) + ": " + data

                it.frames = dao.getFramesFromAnalise(id).toMutableList()
                mAdapter.atualizar(it.frames)
                txt_frames.text = "Frames: ${framesValue()}"

                toggleRecyclerVisibility(it.frames.isEmpty())

                if(it.idserver.isEmpty()){
                    sync_warning.visibility = TextView.VISIBLE
                }
            }

            checkUploadMenu()
        }
    }

    // Salva a analise no servidor / server-side
    private fun saveServer(sucesso: (analise: Analise) -> Unit = {}, erro: (msg: String) -> Unit = {}){
        analise?.let { analiseLocal ->
            AnaliseClient(this).insert( analiseLocal,
                sucesso = {analiseServer ->
                    analiseLocal.idserver = analiseServer.idserver

                    lifecycleScope.launch {
                        dao.updateAnalise(analiseLocal)
                    }

                    sucesso(analiseLocal)

                }, erro = {
                    erro(it)
                }
            )
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
                return "$countUploaded / ${it.frames.size} ("+getString(R.string.upload_completed)+")"
            }

            if (isUploading) {
                return "$countUploaded / ${it.frames.size} ("+getString(R.string.sending)+")"
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
            txt_frames.text = getString(R.string.frames_count, framesValue())
        }
    }

    // Método para iniciar o upload dos frames dessa analise
    private fun uploadFrames() {
        analise?.let { analise ->
            if (analise.idserver.isNotEmpty()) {
                if (!isUploading) {
                    isUploading = true

                    val item: MenuItem? = menu?.findItem(R.id.upload_frames)
                    item?.let {
                        item.setIcon(R.drawable.ic_pause_white_24dp)
                    }

                    if (analise.id > 0) {
                        uploadNextFrame()
                    }

                } else {
                    pauseUpload()
                }
            } else {
                toast(getString(R.string.server_analisis_notfound), "error")
            }
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
                            tempoMilis = frame.tempoMilis,
                            quadrante = frame.quadrante
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
                                        getString(R.string.frames_count, framesValue())


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
        //Log.d("SINAE", "Nenhum frame para upload foi encontrado")
    }

    private fun hideUploadMenu() {
        val item: MenuItem? = menu?.findItem(R.id.upload_frames)
        item?.let {
            item.setVisible(false)
        }
    }

    private fun showUploadMenu() {
        val item: MenuItem? = menu?.findItem(R.id.upload_frames)
        item?.let {
            item.setVisible(true)
        }
    }


    private fun checkUploadMenu() {
        analise?.let {
            if(it.idserver.isEmpty()){
                hideUploadMenu()
            } else {
                lifecycleScope.launch {
                    val uploadableFrame = dao.getFrameFromAnaliseToUpload(it.id)
                    if (uploadableFrame == null) {
                        hideUploadMenu()
                    }
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
        val count: Int = mAdapter.getSelectedItemCount()

        if (count > 0) {
            if (actionMode == null) {
                actionMode = startActionMode(actionModeCallback)
            }
            actionMode?.title = getString(R.string.frames)
            actionMode?.subtitle = getString(R.string.x_selected, count)
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
            val frame = mAdapter.getItem(pos)
            mAdapter.removerItem(frame)

            lifecycleScope.launch {
                frame.removerArquivo()
                dao.deleteFrame(frame)
            }

            mAdapter.notifyDataSetChanged()
            txt_frames.text = getString(R.string.frames_count, framesValue())
        }
    }


    private fun confirmarExclusao() {
        val count = mAdapter.getSelectedItemCount()

        var msg = getString(R.string.frame_exclude_x, count)
        if (count > 1) {
            msg = getString(R.string.frame_exclude_x_plural, count)
        }

        val builder = AlertDialog.Builder(this)
        builder.setTitle(getString(R.string.frames_exclude))
        builder.setMessage(msg)
        builder.setPositiveButton(getString(R.string.yes)) { _, _ ->
            removerItensSelecionados()
            actionMode?.finish()
        }
        builder.setNegativeButton(getString(R.string.no)) { _, _ -> }
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
