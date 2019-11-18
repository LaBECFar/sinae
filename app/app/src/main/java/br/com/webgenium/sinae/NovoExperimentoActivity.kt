package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import br.com.webgenium.sinae.api.CallbackResponse
import br.com.webgenium.sinae.api.ExperimentoClient
import br.com.webgenium.sinae.database.AppDao
import br.com.webgenium.sinae.database.AppDatabase
import br.com.webgenium.sinae.model.Experimento
import kotlinx.android.synthetic.main.activity_novo_experimento.*
import kotlinx.coroutines.runBlocking


class NovoExperimentoActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy {  AppDatabase(this) }
    private val dao: AppDao by lazy {  db.dao() }

    private var experimento = Experimento()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento)

        btn_continuar.setOnClickListener {
            if( validacao() ) {
                val codigo = et_codigo.text.toString()

                ExperimentoClient(this).getByCodigo( codigo, object: CallbackResponse<Experimento>{
                    override fun success(response: Experimento) {
                        experimento.codigo = response.codigo
                        experimento.label = response.label
                        et_codigo.setText(response.codigo)
                        salvarExperimento()
                        abrirExperimentoActivity()
                    }
                })

            }
        }
    }

    // Inicia uma activity para exibir os dados do experimento
    private fun abrirExperimentoActivity(){
        if(experimento.id > 0) {
            val intent = Intent(this, ExperimentoActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            intent.putExtra("experimentoId", experimento.id)
            startActivity(intent)
        } else {
            Log.e("NovoExperimentoActivity", "ID do experimento não encontrado")
        }
    }

    private fun salvarExperimento(){
        if(experimento.id <= 0) {
            runBlocking {
                val experimentoId = dao.insertExperimento( experimento )
                if (experimento.id != experimentoId) {
                    experimento.id = experimentoId
                }
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


    private fun validacao(): Boolean {
        return validarCodigo()
    }


    private fun validarCodigo(): Boolean{
        var isValid = true

        val codigo = et_codigo.text.toString()
        var errorMsg = ""

        if(codigo.trim() == ""){
            errorMsg = "Digite o código do experimento"
            isValid = false
        }

        if(!isValid){
            et_codigo.requestFocus()
            et_codigo.error = errorMsg
        }

        return isValid
    }

}
