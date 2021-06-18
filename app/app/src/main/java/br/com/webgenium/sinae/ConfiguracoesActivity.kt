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
        loadInterval()
        loadFiletype()
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

    private fun loadFiletype() {
        val types = resources.getStringArray(R.array.filetypes)
        val filetype = sharedPreference.getValueString("filetype")

        types.forEachIndexed  { index, item ->
            if(item == filetype) {
                et_filetype.setSelection(index)
                return
            }
        }

    }

    private fun loadPort() {
        val port = sharedPreference.getValueString("api_port")
        if (port != null) {
            et_port.setText(port)
        }
    }

    private fun loadInterval(){
        val interval = sharedPreference.getValueInt("interval")
        if (interval > 0) {
            et_interval.setText(interval.toString())
        } else {
            et_interval.setText(getString(R.string.default_interval))
        }
    }

    private fun saveConfig() {
        val isPortSaved = savePort()
        val isUrlSaved = saveUrl()
        val isIntervalSaved = saveInterval()
        val isQuadrantsSaved = saveQuadrants()
        val isFiletypeSaved = saveFiletype()

        if(isPortSaved && isUrlSaved && isIntervalSaved && isQuadrantsSaved && isFiletypeSaved){
            toast(getString(R.string.config_saved), TOAST_SUCCESS)
        } else {
            toast(getString(R.string.config_invalid), TOAST_ERROR)
        }
    }

    private fun saveInterval(): Boolean {
        var interval = 1000

        if(et_interval.text.toString().isNotEmpty()){
            interval = et_interval.text.toString().toInt()
        } else {
            et_interval.setText(interval)
        }

        if (interval <= 0) {
            et_interval.error = getString(R.string.bigger_than_0)
        }

        if(et_interval.error == null){
            sharedPreference.save("interval", interval)
            return true
        }

        return false
    }

    private fun saveFiletype(): Boolean {
        val filetype = et_filetype.selectedItem.toString()
        sharedPreference.save("filetype", filetype)
        return true
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
