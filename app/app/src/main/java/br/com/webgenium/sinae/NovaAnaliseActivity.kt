package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.database.AppDao
import br.com.webgenium.sinae.database.AppDatabase
import br.com.webgenium.sinae.model.Analise
import kotlinx.android.synthetic.main.activity_nova_analise.*
import kotlinx.coroutines.launch

class NovaAnaliseActivity : AppCompatActivity() {


    private val db: AppDatabase by lazy {  AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }
    private var analise = Analise()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nova_analise)

        val experimentoCodigo = intent.getStringExtra("experimentoCodigo") ?: ""

        lifecycleScope.launch {
            analise.experimento = dao.getExperimentoByCodigo(experimentoCodigo)

            analise.experimento?.let{
                analise.experimentoCodigo = it.codigo
            }
        }


        btn_continuar.setOnClickListener {
            analise.tempo = et_tempo.text.toString()
            analise.fps = et_fps.text.toString().toInt()

            val intent = Intent(this, NovaAnaliseVideoActivity::class.java)
            intent.putExtra("analise", analise)
            startActivity( intent )
        }
    }

}
