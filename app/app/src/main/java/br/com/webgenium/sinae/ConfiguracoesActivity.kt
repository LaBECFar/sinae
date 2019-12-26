package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.URLUtil
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


        if (url.isEmpty()) {
            et_url.error = "Campo obrigatório"
        } else if( !URLUtil.isValidUrl(url) ) {
            et_url.error = "URL Inválida"
        }


        if (port.isEmpty()) {
            et_port.error = "Campo obrigatório"
        }

        if(et_fps.text.toString().isNotEmpty()){
            fps = et_fps.text.toString().toInt()
        } else {
            et_fps.setText(fps)
        }

        if (fps <= 0) {
            et_fps.error = "Deve ser maior que 0"
        }


        if(et_port.error == null && et_fps.error == null && et_url.error == null){
            sharedPreference.save("api_url", url)
            sharedPreference.save("api_port", port)
            sharedPreference.save("fps", fps)

            toast("Configurações Salvas", "success")
        } else {
            toast("Configurações inválidas", "error")
        }


    }
}
