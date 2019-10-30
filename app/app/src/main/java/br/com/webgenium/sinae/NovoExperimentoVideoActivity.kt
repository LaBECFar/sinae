package br.com.webgenium.sinae


import android.annotation.SuppressLint
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.graphics.Bitmap
import android.media.MediaMetadataRetriever
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.provider.MediaStore
import android.util.Log
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.room.AppDatabase
import br.com.webgenium.sinae.room.Experimento
import br.com.webgenium.sinae.room.ExperimentoDao
import br.com.webgenium.sinae.room.ImagemExperimento
import kotlinx.android.synthetic.main.activity_novo_experimento_video.*
import kotlinx.android.synthetic.main.include_progress_overlay.*
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.OutputStream
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.launch


class NovoExperimentoVideoActivity : AppCompatActivity() {

    private var videoUri : Uri? = null
    private var timerHandler: Handler = Handler()
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

        experimento = intent.getSerializableExtra("experimento") as Experimento

        selecionarVideo()

        videoview.setOnClickListener {
            toggleVideo()
        }

        videoview.setOnCompletionListener {
            stopTimer()
        }

        btn_selecionar_tempo.setOnClickListener {
            selectTime()
        }

        btn_iniciar_extracao.setOnClickListener {
            saveExperimento()
        }
    }


    // Salva o experimento no banco de dados
    private fun saveExperimento(){

        // Se o experimento não for null, inserir no banco de dados
        experimento?.let {

            progress_overlay.visibility = View.VISIBLE

            it.quadrantes = getQuadrantes()

            val r = Runnable {
                lifecycleScope.launch {
                    val experimentoId = dao.insert(it)

                    if (it.id <= 0) {
                        it.id = experimentoId
                    }


                    val frames: List<Frame> = extractFrames(experimentoId)

                    updateProgress(frames.size.toString())

                    saveFrames(frames)

                    runOnUiThread {
                        progress_overlay.visibility = View.INVISIBLE

                        val intent = Intent(baseContext, MainActivity::class.java)
                        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
                        startActivity(intent)
                    }
                }
            }
            Thread(r).start()
        }
    }


    private fun extractFrames(experimentoId: Long): List<Frame> {

        val frames = mutableListOf<Frame>()
        val milisecondsToFrame: Long = (1000 / experimento!!.fps).toLong()

        var q = 1
        experimento?.quadrantes?.forEach {
            val tempo = it.split("-")

            val inicioQuadrante = stringToTime(tempo[0])
            val fimQuadrante = stringToTime(tempo[1])

            for (t in inicioQuadrante until fimQuadrante step milisecondsToFrame){

                var tString = t.toString()
                if(t < 1000){
                    tString = "0$t"
                }

                val filename =  "${experimentoId}_${experimento?.label}_${experimento?.tempo}_Q${q}_${tString}"

                val frame = Frame(filename, t)
                frames.add(frame)
            }

            q++
        }

        return frames
    }


    data class Frame(var filename: String, var time: Long)


    private fun saveFrames(frames: List<Frame>){
        val mediaretriever = MediaMetadataRetriever()
        mediaretriever.setDataSource(this, videoUri)

        var countDown = frames.size

        frames.forEach { frame ->
            val bmp: Bitmap = mediaretriever.getFrameAtTime( frame.time )
            val file = saveFrameToInternalStorage(bmp, frame.filename)


            val image = ImagemExperimento()
            image.frame = file.toString()
            image.experimentoId = experimento!!.id


            lifecycleScope.launch {
                dao.insertImage( image )
            }

            countDown--

            runOnUiThread {
                updateProgress(countDown.toString())
            }

        }

        mediaretriever.release()
        mediaretriever.close()

    }

    private fun updateProgress(count: String){
        progress_txt.text = count
    }


    private fun saveFrameToInternalStorage(bmp: Bitmap, filename: String): Uri{

        val wrapper = ContextWrapper(applicationContext)
        var file = wrapper.getDir("frames", Context.MODE_PRIVATE)

        // Arquivo em que a imagem sera salva
        file = File(file, "${filename}.jpg")

        try {
            val stream: OutputStream = FileOutputStream(file)
            bmp.compress(Bitmap.CompressFormat.JPEG, 70, stream)
            stream.flush()
            stream.close()
        } catch (e: IOException){ // Catch the exception
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
    private fun selectTime(){
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
    private fun toggleVideo(){
        if(videoview.isPlaying){
            videoview.pause()
            stopTimer()
        } else {
            videoview.start()
            startTimer()
        }
    }


    // Timer utilizado para atualizar a contagem de tempo em outra thread para não travar o app
    private var timer: Runnable = object : Runnable {
        override fun run() {
            try {
                updateTimer()
            } finally {
                timerHandler.postDelayed( this, timerInterval )
            }
        }
    }


    private fun startTimer(){
        timer.run()
    }


    private fun stopTimer(){
        timerHandler.removeCallbacks(timer)
        updateTimer()
    }


    @SuppressLint("SetTextI18n")
    private fun updateTimer(){
        val tempoAtual = videoview.currentPosition.toLong()
        val tempo = timeToString(tempoAtual)
        txt_tempo.text = tempo+"s"
    }


    // Converte o tempo em milisegundos para string no formato 00:00
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


    // Converte uma string em formato 00:00 para milisegundos
    private fun stringToTime(time: String) : Long {
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
                        videoUri = data.data
                        videoview.setVideoURI(videoUri)
                    }
                } catch (e: IOException){
                    Toast.makeText(this, "Erro ao selecionar vídeo!", Toast.LENGTH_SHORT).show()
                }
            }
        } else {
            finish()
        }
    }
}