package br.com.webgenium.sinae

import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.custom.SharedPreference
import br.com.webgenium.sinae.custom.hideKeyboard
import br.com.webgenium.sinae.database.AppDao
import br.com.webgenium.sinae.database.AppDatabase
import br.com.webgenium.sinae.model.Analise
import kotlinx.android.synthetic.main.activity_nova_analise.*
import kotlinx.coroutines.launch
import java.util.*


class NovaAnaliseActivity : AppCompatActivity() {

    private val db: AppDatabase by lazy {  AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }
    private val analise = Analise()


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nova_analise)

        val experimentoCodigo = intent.getStringExtra("experimentoCodigo") ?: ""

        lifecycleScope.launch {
            analise.experimento = dao.getExperimentoByCodigo(experimentoCodigo)

            analise.experimento?.let{
                analise.experimentoCodigo = it.codigo
            }
        }

        et_data.setOnClickListener {
            hideKeyboard()
            selectDataColeta()
        }


        btn_continuar.setOnClickListener {
            selectVideo()
        }
    }


    // Exibe um DatePicker para o usuário escolher uma data da coleta em que a analise/vídeo foi feita
    private fun selectDataColeta(){
        val calendar = Calendar.getInstance()
        val cYear = calendar.get(Calendar.YEAR)
        val cMonth = calendar.get(Calendar.MONTH)
        val cDay = calendar.get(Calendar.DAY_OF_MONTH)

        val datepicker = DatePickerDialog(this@NovaAnaliseActivity, DatePickerDialog.OnDateSetListener { _, year, month, day ->
            val dateString = String.format("%02d/%02d/%d ", day, month+1, year)
            et_data.text = dateString
            et_data.tag = String.format("%d-%02d-%02d", year, month+1, day)
        }, cYear, cMonth, cDay)

        datepicker.show()
    }


    // Acopla as informações a uma nova analise e encaminha para a activity de seleção e opções do vídeo
    private fun selectVideo(){
        val sharedPreference = SharedPreference( this )

        analise.interval = sharedPreference.getValueInt("interval")
        analise.tempo = et_tempo.text.toString()
        analise.placa = et_placa.text.toString()
        analise.dataColeta = et_data.tag as String

        val intent = Intent(this, NovaAnaliseVideoActivity::class.java)
        intent.putExtra("analise", analise)
        startActivity( intent )
    }

}
