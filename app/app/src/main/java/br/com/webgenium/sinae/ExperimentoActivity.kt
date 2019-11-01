package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.TextView
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.adapter.AnaliseAdapter
import br.com.webgenium.sinae.room.*
import kotlinx.android.synthetic.main.activity_experimento.*
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch


class ExperimentoActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }

    private var experimento: Experimento? = null
    private var mAdapter = AnaliseAdapter(listOf())


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
            intent.putExtra("experimentoId", it.id)
            startActivity(intent)
        }
    }


    @SuppressLint("SetTextI18n")
    override fun onResume() {
        super.onResume()

        val id: Long = intent.getLongExtra("experimentoId", 0)

        lifecycleScope.launch {

            dao.getExperimentoById(id)?.collect {
                experimento = it
                titulo.text = getString(R.string.experimento) + " " + it.codigo
                label.text = it.label

                dao.getAnalises(id).collect { list: List<Analise> ->
                    mAdapter.atualizar(list)

                    if (list.isNotEmpty()) {
                        txt_analises.visibility = TextView.VISIBLE
                    }
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

        this.mAdapter.onItemClick = { analise ->
            abrirAnaliseActivity(analise.id)
        }

        recyclerview.layoutManager = layoutManager
        recyclerview.adapter = mAdapter
    }

}
