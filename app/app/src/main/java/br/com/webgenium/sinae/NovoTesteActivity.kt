package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import br.com.webgenium.sinae.room.Experimento
import br.com.webgenium.sinae.room.TesteExperimento
import kotlinx.android.synthetic.main.activity_novo_teste_experimento.*

class NovoTesteActivity : AppCompatActivity() {

    private var testeExperimento = TesteExperimento()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_teste_experimento)


        val experimento = intent.getSerializableExtra("experimento") as Experimento
        testeExperimento.experimento = experimento


        btn_continuar.setOnClickListener {
            testeExperimento.tempo = et_tempo.text.toString()
            testeExperimento.fps = et_fps.text.toString().toInt()

            val intent = Intent(this, NovoTesteVideoActivity::class.java)

            intent.putExtra("testeExperimento", testeExperimento)
            startActivity( intent )
        }
    }


    /*
    // Intents possiveis usados nessa activity
    companion object {
        private const val SELECT_VIDEO_REQUEST = 1 // selecionar vídeo da galeria
    }


    // Abre uma tela para o usuário selecionar o video desejado
    private fun selecionarVideo(){
        val galleryIntent = Intent(
            Intent.ACTION_PICK,
            MediaStore.Video.Media.EXTERNAL_CONTENT_URI
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

                        testeExperimento?.tempo = et_tempo.text.toString()
                        testeExperimento?.fps = et_fps.text.toString().toInt()

                        val intent = Intent(this, NovoTesteVideoActivity::class.java)
                        intent.putExtra("video", videoURI.toString())
                        intent.putExtra("testeExperimento", testeExperimento)
                        startActivity( intent )

                    }
                } catch (e: IOException){
                    Toast.makeText(this, "Erro ao selecionar vídeo!", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

   */
}
