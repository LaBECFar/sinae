package br.com.webgenium.sinae.api

import android.content.Context
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
                context.toast("Não foi possivel se comunicar", "error")
            }
        })
    }

    fun insert(analise: Analise, sucesso: (analise: Analise) -> Unit, erro: (msg: String) -> Unit) {
        val call = RetrofitInitializer(context).analiseService().insert(analise)

        call.enqueue(callback { response, thorwable ->
            response?.body()?.let {
                context.toast("Analise (${analise.tempo}) cadastrada com sucesso!", "success")
                sucesso(it)
            }

            thorwable?.let {
                context.toast("Não foi possivel comunicar-se com o servidor", "error")
                erro(it.message.toString())
            }
        })
    }
}