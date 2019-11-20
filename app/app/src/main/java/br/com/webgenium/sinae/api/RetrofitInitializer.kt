package br.com.webgenium.sinae.api

import android.content.Context
import br.com.webgenium.sinae.custom.SharedPreference
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RetrofitInitializer(val context: Context) {

    private var url = "http://localhost"
    private var port = "3000"
    private var retrofit: Retrofit

    init {
        val sharedPreference = SharedPreference( context )
        url = sharedPreference.getValueString("api_url").toString()
        port = sharedPreference.getValueString("api_port").toString()

        retrofit = Retrofit.Builder()
            .baseUrl("$url:$port")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    fun experimentoService(): ExperimentoService = retrofit.create(ExperimentoService::class.java)

    fun analiseService(): AnaliseService = retrofit.create(AnaliseService::class.java)


}