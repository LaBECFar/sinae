package br.com.webgenium.sinae.api

import android.content.Context
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.model.Experimento

class ExperimentoClient(val context: Context) {

    fun getByCodigo(codigo: String, successo: (experimento: Experimento) -> Unit){
        val call = RetrofitInitializer(context).experimentoService().getByCodigo(codigo)

        call.enqueue(callback { response, thorwable ->

            response?.body()?.let {
                successo(it)
            } ?: run {
                context.toast("Experimento não encontrado", "error")
            }

            thorwable?.let {
                context.toast("Não foi possivel se comunicar", "error")
            }
        })
    }

}