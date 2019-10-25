package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import br.com.webgenium.sinae.room.Experimento
import kotlinx.android.synthetic.main.activity_novo_experimento.*
import java.io.IOException

class NovoExperimentoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento)

        btn_continuar.setOnClickListener {
            selecionarVideo()
        }
    }

    // Intents possiveis usados nessa activity
    companion object {
        private const val SELECT_VIDEO_REQUEST = 1 // selecionar vídeo da galeria
    }


    // Abre uma tela para o usuário selecionar o video desejado
    private fun selecionarVideo(){

        val galleryIntent = Intent(
            Intent.ACTION_PICK,
            android.provider.MediaStore.Video.Media.EXTERNAL_CONTENT_URI
        )

        startActivityForResult(galleryIntent, SELECT_VIDEO_REQUEST)
    }


    // Retorno/callback dos Intents solicitados nessa activity
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)


        if (requestCode == SELECT_VIDEO_REQUEST && resultCode == RESULT_OK) {
            if (data != null) {
                try {
                    if (data.data != null) {

                        val videoURI = data.data

                        var experimento = Experimento()
                        experimento.codigo = et_codigo.text.toString()
                        experimento.tempo = et_tempo.text.toString()
                        experimento.fps = et_fps.text.toString().toInt()
                        experimento.label = et_label.text.toString()

                        val intent = Intent(this, NovoExperimentoVideoActivity::class.java)
                        intent.putExtra("video", videoURI.toString())
                        intent.putExtra("experimento", experimento)
                        startActivity( intent )

                        /*
                        // converte video em frame
                        val mMMR = MediaMetadataRetriever()
                        mMMR.setDataSource(this, videoURI)
                        iv.setImageBitmap( mMMR.frameAtTime )
                        frame2.setImageBitmap(mMMR.getFrameAtTime(2000000))
                        */
                    }
                } catch (e: IOException){
                    Toast.makeText(this, "Erro ao selecionar vídeo!", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
