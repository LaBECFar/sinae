package br.com.webgenium.sinae.api

import android.content.Context
import android.net.Uri
import android.util.Log
import android.webkit.MimeTypeMap
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.custom.TOAST_ERROR
import br.com.webgenium.sinae.custom.toast
import br.com.webgenium.sinae.model.Frame
import okhttp3.MediaType
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.io.File


class FrameClient(val context: Context)  {

    fun uploadFrame(frame: Frame, experimentoCodigo: String, analiseId: String, tempoMilis: Long, quadrante: Int,  successo: (frame: Frame) -> Unit){

        val fileUri = Uri.parse(frame.uri)
        if(fileUri === null){
            // Log.d("SINAE", "FrameClient: Null URI")
        } else {
            val file = File(fileUri.path!!)
            val fileType = getMimeType(frame.uri)
            val requestFile = RequestBody.create(MediaType.parse(fileType), file)
            val fileBody = MultipartBody.Part.createFormData("frame", file.name, requestFile)

            val experimentoCodigoBody = RequestBody.create(MultipartBody.FORM, experimentoCodigo)
            val analiseIdBody = RequestBody.create(MultipartBody.FORM, analiseId)
            val tempoMilisBody = RequestBody.create(MultipartBody.FORM, tempoMilis.toString())
            val quadranteBody = RequestBody.create(MultipartBody.FORM, quadrante.toString())

            val call = RetrofitInitializer(context).frameService().upload(
                experimentoCodigo = experimentoCodigoBody,
                analiseId = analiseIdBody,
                tempoMilis = tempoMilisBody,
                quadrante = quadranteBody,
                frame = fileBody

            )

            call.enqueue(callback { response, thorwable ->
                response?.body()?.let {
                    successo(it.toFrame())
                } ?: run {
                    //Log.d("Teste", "Não foi possível cadastrar no servidor" + response?.toString())
                }

                thorwable?.let {
                    context.toast(context.getString(R.string.no_server_communication), TOAST_ERROR)
                }
            })
        }
    }

    private fun getMimeType(url: String?): String? {
        var type: String? = null
        val extension = MimeTypeMap.getFileExtensionFromUrl(url)
        if (extension != null) {
            type = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension)
        }
        return type
    }

}