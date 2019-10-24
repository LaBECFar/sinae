package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.content.Intent
import androidx.lifecycle.lifecycleScope
import kotlinx.android.synthetic.main.activity_main.*
import br.com.webgenium.sinae.room.AppDatabase
import br.com.webgenium.sinae.room.Experimento
import br.com.webgenium.sinae.room.ExperimentoDao
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import androidx.recyclerview.widget.RecyclerView

import br.com.webgenium.sinae.adapter.ExperimentoAdapter
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager


class MainActivity : AppCompatActivity() {

    var mRecyclerView: RecyclerView? = null
    private var mAdapter: ExperimentoAdapter? = null


    private val db: AppDatabase by lazy {
        AppDatabase(this)
    }

    private val dao: ExperimentoDao by lazy {
        db.experimentoDao()
    }
    private var experimentos : List<Experimento>? = listOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btn_novo_experimento.setOnClickListener {
            novoExperimento()
        }

        lifecycleScope.launch {
            dao?.all().collect { list ->
                experimentos = list
            }
        }

        setupRecycler()
    }


    private fun novoExperimento(){

        val intent = Intent(this, NovoExperimentoActivity::class.java)
        startActivity( intent )
    }

    private fun setupRecycler() {
        // Configurando o gerenciador de layout para ser uma lista.
        val layoutManager = LinearLayoutManager(this)
        mRecyclerView?.setLayoutManager(layoutManager)

        // Adiciona o adapter que irá anexar os objetos à lista.
        // Está sendo criado com lista vazia, pois será preenchida posteriormente.
        mAdapter = ExperimentoAdapter(ArrayList(0))
        mRecyclerView?.setAdapter(mAdapter)

        // Configurando um dividr entre linhas, para uma melhor visualização.
        mRecyclerView?.addItemDecoration(
            DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
        )
    }


}