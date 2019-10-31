package br.com.webgenium.sinae

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.adapter.ExperimentoAdapter
import br.com.webgenium.sinae.room.*
import kotlinx.android.synthetic.main.activity_experimento.*
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch


class ExperimentoActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy {  AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }


    private var experimento: Experimento? = null


    private var testes: List<TesteExperimento> = listOf()
    private var experimentos : List<Experimento> = listOf()

    private var mAdapter = ExperimentoAdapter(listOf())


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_experimento)
        setupRecycler()
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

                dao.getExperimentos()?.collect { list: List<Experimento> ->
                    experimentos = list
                    mAdapter?.changeExperimentos(experimentos)
                }
            }


        }
    }

//    private fun abrirTesteActivity(){
//        val intent = Intent(this, TesteActivity::class.java)
//        intent.putExtra("experimentoId", experimento?.id)
//        startActivity( intent )
//    }


    private fun setupRecycler() {

        val layoutManager = LinearLayoutManager(this)
        layoutManager.orientation = LinearLayoutManager.VERTICAL

//        this.mAdapter?.onItemClick = { experimento ->
//            abrirTesteActivity(experimento.id)
//        }

        recyclerview.layoutManager = layoutManager
        recyclerview.adapter = mAdapter

        // Configurando um dividr entre linhas, para uma melhor visualização.
        recyclerview.addItemDecoration(
            DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
        )
    }

}
