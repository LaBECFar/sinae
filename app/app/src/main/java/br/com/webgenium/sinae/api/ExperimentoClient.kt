package br.com.webgenium.sinae.api

import android.content.Context
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.model.Experimento

class ExperimentoClient(val context: Context) {

//    fun list(experimentoResponse: CallbackResponse<List<Experimento>>){
//        val call = RetrofitInitializer().experimentoService().list()
//
//        call.enqueue(object : Callback<List<Experimento>?> {
//            override fun onResponse(call: Call<List<Experimento>?>?, response: Response<List<Experimento>?>?) {
//                response?.body()?.let {
//                    experimentoResponse.success(it)
//                }
//            }
//
//            override fun onFailure(call: Call<List<Experimento>?>?, t: Throwable?) {
//                Log.e("onFailure error", t?.message)
//            }
//        })
//    }

    fun getByCodigo(codigo: String, successo: (experimento: Experimento) -> Unit){
        val call = RetrofitInitializer().experimentoService().getByCodigo(codigo)

        call.enqueue(callback { response, thorwable ->

            response?.body()?.let {
                successo(it)
            } ?: run {
                context.toast("Experimento não encontrado")
            }

            thorwable?.let {
                context.toast("Não foi possivel se comunicar")
            }
        })
    }
}