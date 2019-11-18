package br.com.webgenium.sinae.api

import android.content.Context
import android.util.Log
import android.widget.Toast
import br.com.webgenium.sinae.model.Experimento
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

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


    fun getByCodigo(codigo: String, experimentoResponse: CallbackResponse<Experimento>){
        val call = RetrofitInitializer().experimentoService().getByCodigo(codigo)

        call.enqueue(object : Callback<Experimento?> {
            override fun onResponse(call: Call<Experimento?>, response: Response<Experimento?>) {
                response.body()?.let{
                    experimentoResponse.success(it)
                }
            }

            override fun onFailure(call: Call<Experimento?>, t: Throwable) {
                Toast.makeText(context, "Experimento não encontrado", Toast.LENGTH_SHORT).show()
                Log.e("onFailure error", t?.message)

            }
        })
    }
}