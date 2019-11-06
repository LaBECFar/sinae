package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
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


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_analise)
        setupRecycler()
    }

    override fun onResume() {
        super.onResume()

        val id: Long = intent.getLongExtra("analiseId", 0)

        lifecycleScope.launch {
            dao.getAnaliseById(id)?.collect {
                txt_titulo.text = it.tempo
                txt_fps.text = "FPS: " + it.fps

                dao.getFramesFromAnalise(id).collect { list ->
                    txt_frames.text = "Frames: " + list.size.toString()
                    mAdapter.atualizar(list)

                }
            }
        }
    }


    private fun setupRecycler() {
        val layoutManager = LinearLayoutManager(this)
        layoutManager.orientation = LinearLayoutManager.VERTICAL
        recyclerview.layoutManager = layoutManager

        mAdapter.onItemClick = {
            abrirFrameActivity(it.frame)
        }

        recyclerview.adapter = mAdapter
    }


    private fun abrirFrameActivity(imageSrc: String) {
        val intent = Intent(this, FrameActivity::class.java)
        intent.putExtra("imageSrc", imageSrc)
        startActivity(intent)
    }
}
