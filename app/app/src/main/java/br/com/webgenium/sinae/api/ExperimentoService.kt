package br.com.webgenium.sinae.api

import br.com.webgenium.sinae.model.Experimento
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Path

interface ExperimentoService {

    @GET("experimento/codigo/{cod}")
    fun getByCodigo(@Path("cod") codigo: String) : Call<Experimento>

}