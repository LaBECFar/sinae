package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.content.Intent
import kotlinx.android.synthetic.main.activity_main.*
import android.widget.Toast
import java.io.IOException


class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        btn_novo_experimento.setOnClickListener {
            novoExperimento()
        }
    }


    private fun novoExperimento(){

        val intent = Intent(this, NovoExperimentoActivity::class.java)
        startActivity( intent )
    }




}