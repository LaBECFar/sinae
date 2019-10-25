package br.com.webgenium.sinae


import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.room.AppDatabase
import br.com.webgenium.sinae.room.Experimento
import br.com.webgenium.sinae.room.ExperimentoDao
import kotlinx.android.synthetic.main.activity_novo_experimento_video.*
import kotlinx.coroutines.launch
import java.util.concurrent.TimeUnit



class NovoExperimentoVideoActivity : AppCompatActivity() {

    private var videoUri : Uri? = null
    private var timerHandler: Handler? = null
    private var timerInterval: Long = 500

    private var experimento: Experimento? = null

    private val db: AppDatabase by lazy {
        AppDatabase(this)
    }

    private val dao: ExperimentoDao by lazy {
        db.experimentoDao()
    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento_video)

        var intent = getIntent()

        this.experimento = intent.getSerializableExtra("experimento") as Experimento

        timerHandler = Handler()

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

            when {
                q1_inicio.text.isEmpty() -> q1_inicio.setText(currentTime)
                q1_fim.text.isEmpty() -> q1_fim.setText(currentTime)
                q2_inicio.text.isEmpty() -> q2_inicio.setText(currentTime)
                q2_fim.text.isEmpty() -> q2_fim.setText(currentTime)
                q3_inicio.text.isEmpty() -> q3_inicio.setText(currentTime)
                q3_fim.text.isEmpty() -> q3_fim.setText(currentTime)
                q4_inicio.text.isEmpty() -> q4_inicio.setText(currentTime)
                q4_fim.text.isEmpty() -> q4_fim.setText(currentTime)
            }
        }

        btn_iniciar_extracao.setOnClickListener {
            var intent = Intent(this, MainActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)

            val q1 = q1_inicio.text.toString() + '-' + q1_fim.text.toString()
            val q2 = q2_inicio.text.toString() + '-' + q2_fim.text.toString()
            val q3 = q3_inicio.text.toString() + '-' + q3_fim.text.toString()
            val q4 = q4_inicio.text.toString() + '-' + q4_fim.text.toString()

            experimento?.quadrantes = listOf(q1, q2, q3, q4)


            lifecycleScope.launch {
                if (experimento != null){
                    dao?.insert(experimento!!)
                }
            }

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