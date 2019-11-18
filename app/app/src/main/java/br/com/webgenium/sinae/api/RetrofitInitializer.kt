package br.com.webgenium.sinae.api

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RetrofitInitializer {

    private val retrofit = Retrofit.Builder()
            .baseUrl("http://192.168.133.161:3000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    fun experimentoService(): ExperimentoService = retrofit.create(ExperimentoService::class.java)


}