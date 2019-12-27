package br.com.webgenium.sinae.api

import android.content.Context
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.model.Analise

class AnaliseClient(val context: Context) {

    fun list(codigo: String, successo: (analises: List<Analise>) -> Unit){
        val call = RetrofitInitializer(context).analiseService().list(codigo)

        call.enqueue(callback { response, thorwable ->

            response?.body()?.let {
                successo(it)
            }

            thorwable?.let {
                val msg = context.getString(R.string.no_server_communication)
                context.toast(msg, "error")
            }
        })
    }

    fun insert(analise: Analise, sucesso: (analise: Analise) -> Unit, erro: (msg: String) -> Unit) {
        val call = RetrofitInitializer(context).analiseService().insert(analise)

        call.enqueue(callback { response, thorwable ->
            response?.body()?.let {
                val msg = context.getString(R.string.analisis_successfully_registered, analise.tempo)
                context.toast(msg, "success")
                sucesso(it)
            }

            thorwable?.let {
                val msg = context.getString(R.string.no_server_communication)
                context.toast(msg, "error")
                erro(it.message.toString())
            }
        })
    }
}