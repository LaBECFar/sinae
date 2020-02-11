package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.URLUtil
import android.widget.EditText
import br.com.webgenium.sinae.custom.*
import kotlinx.android.synthetic.main.activity_configuracoes.*

class ConfiguracoesActivity : AppCompatActivity() {

    private val sharedPreference: SharedPreference by lazy {  SharedPreference(this) }
    private var quadrants : ArrayList<EditText> = arrayListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_configuracoes)

        btn_save.setOnClickListener {
            saveConfig()
        }

        quadrants = arrayListOf(q1_inicio, q1_fim, q2_inicio, q2_fim, q3_inicio, q3_fim, q4_inicio, q4_fim)
        setupQuadrants()
        loadConfig()
    }

    private fun setupQuadrants(){
        quadrants.forEach {
            it.customMask("##:##")
        }
    }

    private fun loadConfig(){
        loadUrl()
        loadPort()
        loadFps()
        loadQuadrants()
    }

    private fun loadQuadrants() {
        quadrants.forEach {
            val tag = it.tag.toString()
            val valor = sharedPreference.getValueString(tag)

            valor?.let { v ->
                if(v.isNotEmpty()){
                    it.setText(valor)
                }
            }
        }
    }

    private fun loadUrl() {
        val url = sharedPreference.getValueString("api_url")
        if (url != null) {
            et_url.setText(url)
        }
    }

    private fun loadPort() {
        val port = sharedPreference.getValueString("api_port")
        if (port != null) {
            et_port.setText(port)
        }
    }

    private fun loadFps(){
        val fps = sharedPreference.getValueInt("fps")
        if (fps > 0) {
            et_fps.setText(fps.toString())
        } else {
            et_fps.setText("1")
        }
    }

    private fun saveConfig() {
        val isPortSaved = savePort()
        val isUrlSaved = saveUrl()
        val isFpsSaved = saveFps()
        val isQuadrantsSaved = saveQuadrants()

        if(isPortSaved && isUrlSaved && isFpsSaved && isQuadrantsSaved){
            toast(getString(R.string.config_saved), TOAST_SUCCESS)
        } else {
            toast(getString(R.string.config_invalid), TOAST_ERROR)
        }
    }

    private fun saveFps(): Boolean {
        var fps = 1

        if(et_fps.text.toString().isNotEmpty()){
            fps = et_fps.text.toString().toInt()
        } else {
            et_fps.setText(fps)
        }

        if (fps <= 0) {
            et_fps.error = getString(R.string.bigger_than_0)
        }

        if(et_fps.error == null){
            sharedPreference.save("fps", fps)
            return true
        }

        return false
    }

    private fun saveUrl() : Boolean {
        val url = et_url.text.toString()

        if (url.isEmpty()) {
            et_url.error = getString(R.string.required_field)
        } else if( !URLUtil.isValidUrl(url) ) {
            et_url.error = getString(R.string.invalid_url)
        }

        if(et_url.error == null){
            sharedPreference.save("api_url", url)
            return true
        }

        return false
    }

    private fun savePort() : Boolean {
        val port = et_port.text.toString()

        if (port.isEmpty()) {
            et_port.error = getString(R.string.required_field)
        }

        if(et_port.error == null){
            sharedPreference.save("api_port", port)
            return true
        }

        return false
    }

    private fun saveQuadrants() : Boolean {
        val result = true

        quadrants.forEach {
            val valor = it.text.toString()

            if(valor.isNotEmpty()){
                val tag = it.tag.toString()
                sharedPreference.save(tag, valor)
            }
        }

        return result
    }
}
