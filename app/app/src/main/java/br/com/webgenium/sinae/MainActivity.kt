package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.content.Intent
import androidx.lifecycle.lifecycleScope
import kotlinx.android.synthetic.main.activity_main.*
import br.com.webgenium.sinae.room.AppDatabase
import br.com.webgenium.sinae.room.Experimento
import br.com.webgenium.sinae.room.AppDao
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import br.com.webgenium.sinae.adapter.ExperimentoAdapter
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager


class MainActivity : AppCompatActivity() {

    private var mAdapter = ExperimentoAdapter(listOf())

    private val db: AppDatabase by lazy {  AppDatabase(this) }
    private val dao: AppDao by lazy {  db.dao() }

    private var experimentos : List<Experimento> = listOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btn_novo_experimento.setOnClickListener {
            novoExperimento()
        }

        setupRecycler()

        lifecycleScope.launch {
            dao.getExperimentos().collect { list: List<Experimento> ->
                experimentos = list
                mAdapter.changeExperimentos(experimentos)
            }
        }

    }


    private fun novoExperimento(){
        val intent = Intent(this, NovoExperimentoActivity::class.java)
        startActivity( intent )
    }


    private fun verExperimento(id: Long){
        val intent = Intent(this, ExperimentoActivity::class.java)
        intent.putExtra("experimentoId", id)
        startActivity( intent )
    }

    private fun setupRecycler() {

        val layoutManager = LinearLayoutManager(this)
        layoutManager.orientation = LinearLayoutManager.VERTICAL

        mAdapter.onItemClick = { experimento ->
            verExperimento(experimento.id)
        }

        recyclerview.layoutManager = layoutManager
        recyclerview.adapter = mAdapter

        // Configurando um dividr entre linhas, para uma melhor visualização.
        recyclerview.addItemDecoration(
            DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
        )
    }


}