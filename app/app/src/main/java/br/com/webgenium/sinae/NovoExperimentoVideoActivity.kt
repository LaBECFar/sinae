package br.com.webgenium.sinae


import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import kotlinx.android.synthetic.main.activity_novo_experimento_video.*
import java.util.concurrent.TimeUnit



class NovoExperimentoVideoActivity : AppCompatActivity() {

    private var videoUri : Uri? = null
    private var timerHandler: Handler? = null
    private var timerInterval: Long = 1000


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento_video)

        timerHandler = Handler()

        val codigo = intent.getStringExtra("codigo")
        val tempo = intent.getStringExtra("tempo")
        val label = intent.getStringExtra("label")
        val fps = intent.getStringExtra("fps")
        val video = intent.getStringExtra("video")

        this.videoUri = Uri.parse( video )
        videoview.setVideoURI(this.videoUri)

        videoview.setOnClickListener {
            if(videoview.isPlaying){
                videoview.pause()
                stopTimer()
            } else {
                videoview.start()
                startTimer()
            }
        }

        videoview.setOnCompletionListener {
            stopTimer()
        }

        btn_selecionar_tempo.setOnClickListener {
            val currentTime = timeToString(videoview.currentPosition.toLong())

            if(q1_inicio.text.isEmpty()) {
                q1_inicio.setText(currentTime)
            } else if(q1_fim.text.isEmpty()) {
                q1_fim.setText(currentTime)
            } else if(q2_inicio.text.isEmpty()) {
                q2_inicio.setText(currentTime)
            } else if(q2_fim.text.isEmpty()) {
                q2_fim.setText(currentTime)
            } else if(q3_inicio.text.isEmpty()) {
                q3_inicio.setText(currentTime)
            } else if(q3_fim.text.isEmpty()) {
                q3_fim.setText(currentTime)
            } else if(q4_inicio.text.isEmpty()) {
                q4_inicio.setText(currentTime)
            } else if(q4_fim.text.isEmpty()) {
                q4_fim.setText(currentTime)
            }
        }

        btn_iniciar_extracao.setOnClickListener {
            val intent = Intent(this, NovoExperimentoVideoActivity::class.java)

            intent.putExtra("q1_inicio", stringToTime(q1_inicio.text.toString()) )
            intent.putExtra("q1_fim", stringToTime(q1_fim.text.toString()) )

            intent.putExtra("q2_inicio", stringToTime(q2_inicio.text.toString()) )
            intent.putExtra("q2_fim", stringToTime(q2_fim.text.toString()) )

            intent.putExtra("q3_inicio", stringToTime(q3_inicio.text.toString()) )
            intent.putExtra("q3_fim", stringToTime(q3_fim.text.toString()) )

            intent.putExtra("q4_inicio", stringToTime(q4_inicio.text.toString()) )
            intent.putExtra("q4_fim", stringToTime(q4_fim.text.toString()) )

            startActivity( intent )
        }
    }

    private var timer: Runnable = object : Runnable {
        override fun run() {
            try {
                updateTimer()
            } finally {
                timerHandler?.postDelayed( this, timerInterval )
            }
        }
    }

    private fun startTimer(){
        timer.run()
    }

    private fun stopTimer(){
        timerHandler?.removeCallbacks(timer)
        updateTimer()
    }

    private fun updateTimer(){
        val tempoAtual = videoview.currentPosition.toLong()
        val tempo = timeToString(tempoAtual)
        txt_tempo.text = "${tempo}s"
    }

    private fun timeToString(time: Long) : String{
        var min = TimeUnit.MILLISECONDS.toMinutes( time ).toString()
        var sec = (TimeUnit.MILLISECONDS.toSeconds( time ) - TimeUnit.MILLISECONDS.toMinutes( time )).toString()

        if(min.count() == 1) {
            min = "0${min}"
        }

        if(sec.count() == 1) {
            sec = "0${sec}"
        }

        return "${min}:${sec}"
    }

    private fun stringToTime(time: String) : Int {
        val t = time.split(":")

        var min = t[0]?.toInt()
        var sec = t[1]?.toInt()
        val milliseconds = ((min * 60) + sec) * 1000

        return milliseconds
    }
}