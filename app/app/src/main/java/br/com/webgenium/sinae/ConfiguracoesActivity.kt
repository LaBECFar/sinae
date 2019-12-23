package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import br.com.webgenium.sinae.custom.SharedPreference
import br.com.webgenium.sinae.custom.toast
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
        val fps = sharedPreference.getValueInt("fps")

        if (url != null) {
            et_url.setText(url)
        }

        if (port != null) {
            et_port.setText(port)
        }

        if (fps > 0) {
            et_fps.setText(fps.toString())
        } else {
            et_fps.setText("1")
        }
    }

    private fun salvarConfiguracoes() {
        val sharedPreference = SharedPreference(this)

        val url = et_url.text.toString()
        val port = et_port.text.toString()
        var fps = 1

        if(et_fps.text.toString().isNotEmpty()){
            fps = et_fps.text.toString().toInt()
        } else {
            et_fps.setText("1")
        }

        if (url.isNotEmpty()) {
            sharedPreference.save("api_url", url)
        }

        if (port.isNotEmpty()) {
            sharedPreference.save("api_port", port)
        }

        if (fps > 0) {
            sharedPreference.save("fps", fps)
        }

        toast("Configurações Salvas")

    }
}
