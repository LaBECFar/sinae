package br.com.webgenium.sinae.api

import android.content.Context
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.model.Experimento

class ExperimentoClient(val context: Context) {

    fun getByCodigo(codigo: String, successo: (experimento: Experimento) -> Unit){
        val call = RetrofitInitializer(context).experimentoService().getByCodigo(codigo)

        call.enqueue(callback { response, thorwable ->

            response?.body()?.let {
                successo(it)
            } ?: run {
                if(thorwable == null) {
                    context.toast(context.getString(R.string.experiment_notfound), "error")
                }
            }

            thorwable?.let {
                context.toast(context.getString(R.string.no_server_communication), "error")
            }
        })
    }

}