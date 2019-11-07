package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Color
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.room.*
import kotlinx.android.synthetic.main.activity_nova_analise_video.*
import kotlinx.android.synthetic.main.include_progress_overlay.*
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.launch
import java.lang.Exception
import kotlinx.coroutines.newSingleThreadContext
import kotlin.math.round
import br.com.webgenium.sinae.adapter.CustomMediaController

class NovaAnaliseVideoActivity : AppCompatActivity() {

    private var videoUri: Uri? = null
    //private var timerHandler: Handler = Handler()
    //private var timerInterval: Long = 500

    private var analise: Analise? = null

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nova_analise_video)

        analise = intent.getSerializableExtra("analise") as Analise

        selecionarVideo()

//        videoview.setOnClickListener {
//            toggleVideo()
//        }
//
//        videoview.setOnCompletionListener {
//            stopTimer()
//        }

        btn_selecionar_tempo.setOnClickListener {
            selectTime()
        }

        btn_iniciar_extracao.setOnClickListener {
            if (validacao()) {
                removerFocus()
                salvarAnalise()
            }
        }
    }

    private fun validacao(): Boolean {
        val duracaoVideo = videoview.duration

        val q1isValid = validarQuadrante(q1_inicio, q1_fim, duracaoVideo)
        val q2isValid = validarQuadrante(q2_inicio, q2_fim, duracaoVideo)
        val q3isValid = validarQuadrante(q3_inicio, q3_fim, duracaoVideo)
        val q4isValid = validarQuadrante(q4_inicio, q4_fim, duracaoVideo)

        return q1isValid && q2isValid && q3isValid && q4isValid
    }

    private fun validarQuadrante(inicioEdt: EditText, fimEdt: EditText, duracaoVideo: Int): Boolean {
        var isValid = true

        if(inicioEdt.text.isEmpty()){
            isValid = false
            inicioEdt.error = "Campo obrigatório"
        }

        if(fimEdt.text.isEmpty()) {
            isValid = false
            fimEdt.error = "Campo obrigatório"
        }

        if(isValid) {
            val inicio = stringToTime(inicioEdt.text.toString())
            val fim = stringToTime(fimEdt.text.toString())

            if (inicio > duracaoVideo) {
                isValid = false
                inicioEdt.error = "Valor inválido"
            }
            if (fim > duracaoVideo) {
                isValid = false
                fimEdt.error = "Valor inválido"
            }
            if (inicio > fim) {
                isValid = false
                fimEdt.error = "O valor final deve ser maior que o inicial"
            }
        }

        return isValid
    }

    private fun removerFocus() {
        q1_inicio.clearFocus()
        q1_fim.clearFocus()

        q2_inicio.clearFocus()
        q2_fim.clearFocus()

        q3_inicio.clearFocus()
        q3_fim.clearFocus()

        q4_inicio.clearFocus()
        q4_fim.clearFocus()
    }

    // Salva o experimento no banco de dados
    private fun salvarAnalise() {

        // Se o experimento não for null, inserir no banco de dados
        analise?.let { analise ->

            progress_overlay.visibility = View.VISIBLE

            analise.quadrantes = getQuadrantes()

            lifecycleScope.launch(newSingleThreadContext("TESTE_SAVE")) {
                val analiseId = dao.insertAnalise(analise)

                if (analiseId > 0) {
                    analise.id = analiseId
                }

                val frames: List<Frame> = extrairFrames(analiseId)

                salvarFrames(frames, analiseId)

                runOnUiThread {
                    progress_overlay.visibility = View.INVISIBLE

                    val intent = Intent(baseContext, ExperimentoActivity::class.java)
                    intent.putExtra("experimentoId", analise.experimentoId)
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                    startActivity(intent)
                }
            }

        }
    }


    private fun extrairFrames(experimentoId: Long): List<Frame> {

        val frames = mutableListOf<Frame>()
        val milisecondsToFrame: Long = (1000 / analise!!.fps).toLong()

        var q = 1
        analise?.quadrantes?.forEach {
            val tempo = it.split("-")

            val inicioQuadrante = stringToTime(tempo[0])
            val fimQuadrante = stringToTime(tempo[1])

            for (t in inicioQuadrante until fimQuadrante step milisecondsToFrame) {

                var tString = t.toString()
                if (t < 1000) {
                    tString = "0$t"
                }

                val filename = "${experimentoId}_${analise?.tempo}_Q${q}_${tString}"

                val frame = Frame(filename, t)
                frames.add(frame)
            }

            q++
        }

        return frames
    }


    data class Frame(var filename: String, var time: Long)


    private suspend fun salvarFrames(frames: List<Frame>, analiseId: Long) {
        val mediaretriever = MediaMetadataRetriever()
        mediaretriever.setDataSource(this, videoUri)

        var count = 0

        frames.forEach { frame ->
            try {
                val microseconds = "${frame.time}000".toLong()
                val bmp: Bitmap = mediaretriever.getFrameAtTime(
                    microseconds,
                    MediaMetadataRetriever.OPTION_CLOSEST_SYNC
                )

                val file = saveFrameToInternalStorage(bmp, frame.filename)

                val image = ImagemExperimento()
                image.frame = file.toString()
                image.analiseId = analiseId
                dao.insertFrame(image)

            } catch (e: Exception) {
                Log.e("Erro", "${timeToString(frame.time)}: ${e.message}")
            }

            count++

            val porcentagem: Double = count.toDouble() / frames.size * 100
            val progresso = round(porcentagem).toInt().toString() + "%"

            runOnUiThread {
                atualizarProgresso(progresso)
            }
        }

        mediaretriever.release()
        mediaretriever.close()

    }

    private fun atualizarProgresso(progresso: String) {
        progress_txt.text = progresso
    }


    private fun saveFrameToInternalStorage(bmp: Bitmap, filename: String): Uri {

        val wrapper = ContextWrapper(applicationContext)
        var file = wrapper.getDir("frames", Context.MODE_PRIVATE)

        // Arquivo em que a imagem sera salva
        file = File(file, "${filename}.jpg")

        try {
            val stream: OutputStream = FileOutputStream(file)
            bmp.compress(Bitmap.CompressFormat.JPEG, 70, stream)
            stream.flush()
            stream.close()
        } catch (e: IOException) { // Catch the exception
            e.printStackTrace()
        }

        // Return the saved image uri
        return Uri.parse(file.absolutePath)

    }

    // Converte os valores digitados nos EditTexts para uma lista de strings
    private fun getQuadrantes(): List<String> {
        val q1 = q1_inicio.text.toString() + '-' + q1_fim.text.toString()
        val q2 = q2_inicio.text.toString() + '-' + q2_fim.text.toString()
        val q3 = q3_inicio.text.toString() + '-' + q3_fim.text.toString()
        val q4 = q4_inicio.text.toString() + '-' + q4_fim.text.toString()

        return listOf(q1, q2, q3, q4)
    }


    // O valor do timer é inserido no próximo EditText vazio, nos quadrantes do vídeo (Q1, Q2, Q3 e Q4)
    private fun selectTime() {
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


    // Pausar ou executar o vídeo da VideoView
//    private fun toggleVideo() {
//        if (videoview.isPlaying) {
//            videoview.pause()
//            stopTimer()
//        } else {
//            videoview.start()
//            startTimer()
//        }
//    }


    // Timer utilizado para atualizar a contagem de tempo em outra thread para não travar o app
//    private var timer: Runnable = object : Runnable {
//        override fun run() {
//            try {
//                updateTimer()
//            } finally {
//                timerHandler.postDelayed(this, timerInterval)
//            }
//        }
//    }


//    private fun startTimer() {
//        timer.run()
//    }
//
//
//    private fun stopTimer() {
//        timerHandler.removeCallbacks(timer)
//        updateTimer()
//    }

//
//    @SuppressLint("SetTextI18n")
//    private fun updateTimer() {
//        val tempoAtual = videoview.currentPosition.toLong()
//        val tempo = timeToString(tempoAtual)
//        txt_tempo.text = tempo + "s"
//    }


    // Converte o tempo em milisegundos para string no formato 00:00
    private fun timeToString(time: Long): String {
        var min = TimeUnit.MILLISECONDS.toMinutes(time).toString()
        var sec =
            TimeUnit.MILLISECONDS.toSeconds(time - TimeUnit.MILLISECONDS.toMinutes(time)).toString()

        if (min.count() == 1) {
            min = "0${min}"
        }

        if (sec.count() == 1) {
            sec = "0${sec}"
        }

        return "${min}:${sec}"
    }


    // Converte uma string em formato 00:00 para milisegundos
    private fun stringToTime(time: String): Long {
        val t = time.split(":")
        val min = t[0].toLong()
        val sec = t[1].toLong()

        return ((min * 60) + sec) * 1000
    }


    // Intents possiveis usados nessa activity
    companion object {
        private const val SELECT_VIDEO_REQUEST = 1 // selecionar vídeo da galeria
    }


    // Abre uma tela para o usuário selecionar o video desejado
    private fun selecionarVideo() {
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
                    data.data?.let {
                        videoUri = it
                        videoview.setZOrderOnTop( true )
                        videoview.setVideoURI(videoUri)



                        videoview.setOnPreparedListener {mediaPlayer ->
                            val mediaController = CustomMediaController(this)

                            mediaPlayer.setOnVideoSizeChangedListener { mp, width, height ->
                                videoview.setMediaController(mediaController)
                                mediaController.setMediaPlayer(videoview)
                                mediaController.setAnchorView(videoview)

                                val viewGroupLevel1: LinearLayout = mediaController.getChildAt(0) as LinearLayout
                                viewGroupLevel1.setBackgroundColor(ContextCompat.getColor(this, R.color.AlmostTransparent))
                                mediaController.show(0)
//                                try {
//                                    val currentTime :Field = getClass().getDeclaredField("mCurrentTime");
//                                    currentTime.setAccessible(true);
//                                    TextView currentTimeTextView = (TextView) currentTime.get(this);
//                                    currentTimeTextView.setTextColor(Color.RED);
//                                } catch (Exception pokemon) {
//                                }

                            }
                            videoview.seekTo(1)
                        }
                    }
                } catch (e: IOException) {
                    Toast.makeText(this, "Erro ao selecionar vídeo!", Toast.LENGTH_SHORT).show()
                }
            }
        } else {
            finish()
        }
    }
}