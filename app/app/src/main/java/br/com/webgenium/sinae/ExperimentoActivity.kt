package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.room.AppDatabase
import br.com.webgenium.sinae.room.Experimento
import br.com.webgenium.sinae.room.ExperimentoDao
import br.com.webgenium.sinae.room.ImagemExperimento
import kotlinx.android.synthetic.main.activity_experimento.*
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch


class ExperimentoActivity : AppCompatActivity() {

    private var experimento: Experimento? = null
    private var frames: List<ImagemExperimento> = listOf()

    private val db: AppDatabase by lazy {
        AppDatabase(this)
    }

    private val dao: ExperimentoDao by lazy {
        db.experimentoDao()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_experimento)

        val id: Long = intent.getLongExtra("experimentoId", 0)

        lifecycleScope.launch {
            dao.getById(id)?.collect {
                experimento = it
                titulo.text = "Experimento ${it.codigo}"
                label.text = it.label
                tempo.text = it.tempo
            }

            dao.getFramesFromExperimento(id)?.collect { list ->
                frames = list
                Log.d("Teste", list.toString())

                list.forEach {
                    Log.d("Teste", it.frame)
                }
            }
        }

    }
}
