package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import br.com.webgenium.sinae.custom.SharedPreference
import kotlinx.android.synthetic.main.activity_configuracoes.*

class ConfiguracoesActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_configuracoes)

        btn_save.setOnClickListener {
            salvarConfiguracoes()
        }

        carregarConfiguracoes()
    }

    private fun carregarConfiguracoes(){
        val sharedPreference = SharedPreference(this)

        val url = sharedPreference.getValueString("api_url")
        val port = sharedPreference.getValueString("api_port")

        if (url != null) {
            et_url.setText(url)
        }

        if (port != null) {
            et_port.setText(port)
        }
    }

    private fun salvarConfiguracoes() {
        val sharedPreference = SharedPreference(this)

        val url = et_url.text.toString()
        val port = et_port.text.toString()

        if (url.isNotEmpty()) {
            sharedPreference.save("api_url", url)
        }

        if (port.isNotEmpty()) {
            sharedPreference.save("api_port", port)
        }

        Toast.makeText(this,"Configurações Salvas", Toast.LENGTH_SHORT).show()

    }
}
