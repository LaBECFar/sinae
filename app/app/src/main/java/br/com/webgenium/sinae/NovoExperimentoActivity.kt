package br.com.webgenium.sinae

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import br.com.webgenium.sinae.room.Experimento
import kotlinx.android.synthetic.main.activity_novo_experimento.*


class NovoExperimentoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_novo_experimento)

        btn_continuar.setOnClickListener {
            var experimento = Experimento()
            experimento.codigo = et_codigo.text.toString()

            val intent = Intent(this, NovoExperimentoOpcoesActivity::class.java)
            intent.putExtra("experimento", experimento)
            startActivity( intent )
        }
    }

    override fun onSaveInstanceState(savedInstanceState: Bundle) {
        super.onSaveInstanceState(savedInstanceState)

        savedInstanceState.putString("codigo", et_codigo.text.toString())
        Log.d("teste", "Saindo: "  + savedInstanceState.getString("codigo"))
    }

    override fun onRestoreInstanceState(savedInstanceState: Bundle) {
        super.onRestoreInstanceState(savedInstanceState)

        val codigo = savedInstanceState.getString("codigo") as String
        et_codigo.setText(codigo)
        Log.d("teste", "Restaudado: " + codigo)
    }


}
