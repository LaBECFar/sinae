package br.com.webgenium.sinae

import android.annotation.SuppressLint
import android.app.DatePickerDialog
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.lifecycleScope
import br.com.webgenium.sinae.custom.SharedPreference
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


    @SuppressLint("SetTextI18n")
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


            val calendar = Calendar.getInstance()
            val year = calendar.get(Calendar.YEAR)
            val month = calendar.get(Calendar.MONTH)
            val day = calendar.get(Calendar.DAY_OF_MONTH)

            val datepicker = DatePickerDialog(this@NovaAnaliseActivity, DatePickerDialog.OnDateSetListener { _, year, monthOfYear, dayOfMonth ->
                et_data.text = "${year}-${monthOfYear}-${dayOfMonth}"
            }, year, month, day)

            datepicker.show()
        }


        btn_continuar.setOnClickListener {
            val sharedPreference = SharedPreference( this )
            val fps = sharedPreference.getValueInt("fps")

            analise.fps = fps
            analise.tempo = et_tempo.text.toString()
            analise.placa = et_placa.text.toString()
            analise.dataColeta = et_data.text.toString()


            val intent = Intent(this, NovaAnaliseVideoActivity::class.java)
            intent.putExtra("analise", analise)
            startActivity( intent )
        }
    }

}
