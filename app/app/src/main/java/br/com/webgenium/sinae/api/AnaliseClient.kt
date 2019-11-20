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
            } ?: run {
                context.toast("Analise não encontrada")
            }

            thorwable?.let {
                context.toast("Não foi possivel se comunicar")
            }
        })
    }

    fun insert(analise: Analise, successo: (analise: Analise) -> Unit) {
        val call = RetrofitInitializer(context).analiseService().insert(analise)

        call.enqueue(callback { response, thorwable ->
            response?.body()?.let {
                successo(it)
            } ?: run {
                context.toast("Erro ao cadastrar analise")
            }

            thorwable?.let {
                context.toast("Não foi possivel se comunicar")
            }
        })
    }
}