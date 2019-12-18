package br.com.webgenium.sinae.api

import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Call
import retrofit2.http.*

interface FrameService {

    @Multipart
    @POST("frame")
    fun upload(
        @Part("experimentoCodigo") experimentoCodigo: RequestBody,
        @Part("analiseId") analiseId: RequestBody,
        @Part("tempoMilis") tempoMilis: RequestBody,
        @Part frame: MultipartBody.Part
    ) : Call<FrameResponse>

}
