package br.com.webgenium.sinae


import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_novo_experimento_video.*


class NovoExperimentoVideoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento_video)

        val videoURI = intent.data
        videoview.setVideoURI(videoURI)
        videoview.start();
    }

}