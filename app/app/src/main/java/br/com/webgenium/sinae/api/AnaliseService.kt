package br.com.webgenium.sinae.api

import br.com.webgenium.sinae.model.Analise
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface AnaliseService {

    @POST("analise")
    fun insert(@Body analise: Analise) : Call<Analise>

}