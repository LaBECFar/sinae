package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.GridLayoutManager
import br.com.webgenium.sinae.adapter.FrameAdapter
import br.com.webgenium.sinae.room.Analise
import br.com.webgenium.sinae.room.AppDao
import br.com.webgenium.sinae.room.AppDatabase
import kotlinx.android.synthetic.main.activity_analise.*
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

class AnaliseActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }

    //private var analise: Analise? = null
    private var mAdapter = FrameAdapter(listOf())


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
                //analise = it

                txt_titulo.text = it.tempo
                txt_fps.text = "FPS: " + it.fps

                dao.getFramesFromAnalise(id).collect { list ->
                    txt_frames.text = "Frames: " + list.size.toString()

                    it.frames = list
                    mAdapter.atualizar(list)

                }
            }

        }

    }


    private fun setupRecycler() {
        val layoutManager = GridLayoutManager(this, 5)
        gridframes.layoutManager = layoutManager
        gridframes.adapter = mAdapter
    }
}
