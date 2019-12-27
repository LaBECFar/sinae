package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.api.ExperimentoClient
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.database.AppDao
import br.com.webgenium.sinae.database.AppDatabase
import br.com.webgenium.sinae.model.Experimento
import kotlinx.android.synthetic.main.activity_novo_experimento.*
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking


class NovoExperimentoActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy {  AppDatabase(this) }
    private val dao: AppDao by lazy {  db.dao() }
    private var experimento = Experimento()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento)

        btn_continuar.setOnClickListener {
            if( validarCodigo() ) {
                val codigo = et_codigo.text.toString()

                ExperimentoClient(this).getByCodigo( codigo ) {
                    experimento.codigo = it.codigo
                    experimento.label = it.label
                    et_codigo.setText(it.codigo)
                    salvarExperimento()
                    abrirExperimentoActivity()
                }

            }
        }
    }

    // Inicia uma activity para exibir os dados do experimento
    private fun abrirExperimentoActivity(){
        if(experimento.codigo.isNotEmpty()) {
            val intent = Intent(this, ExperimentoActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            intent.putExtra("experimentoCodigo", experimento.codigo)
            startActivity(intent)
        } else {
            toast(getString(R.string.experiment_notfound), "error")
        }
    }

    private fun salvarExperimento(){
        if(experimento.codigo.isNotEmpty()) {
            runBlocking {
                dao.insertExperimento( experimento )
            }
        }
    }


    // Salva o estado dos campos para o caso do android fechar a activity
    override fun onSaveInstanceState(savedInstanceState: Bundle) {
        super.onSaveInstanceState(savedInstanceState)
        savedInstanceState.putString("codigo", et_codigo.text.toString())
    }


    // Restora o estado dos campos
    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)
        val codigo = savedInstanceState.getString("codigo") as String
        et_codigo.setText( codigo )
    }


    private fun validarCodigo(): Boolean{
        var isValid = true

        val codigo = et_codigo.text.toString()
        var errorMsg = ""

        if(codigo.trim() == ""){
            errorMsg = getString(R.string.type_experiment_code)
            isValid = false
        }

        runBlocking {
            val experimento = dao.getExperimentoByCodigo(codigo)
            experimento?.let{
                errorMsg = getString(R.string.experiment_already_exists)
                isValid = false
            }
        }

        if(!isValid){
            et_codigo.requestFocus()
            et_codigo.error = errorMsg
        }

        return isValid
    }

}
