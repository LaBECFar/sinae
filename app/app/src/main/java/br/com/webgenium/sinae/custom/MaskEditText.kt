package br.com.webgenium.sinae.custom

import android.text.Editable
import android.text.TextWatcher
import android.widget.EditText

class MaskEditText(var editText: EditText, private var mMask: String) : TextWatcher {

    private var isUpdating: Boolean = false
    private var mOldString = ""
    private var befores = ""

    override fun beforeTextChanged(s: CharSequence, start: Int, count: Int, after: Int) {
        befores = s.toString().replace("[^\\d]".toRegex(), "")
    }

    override fun onTextChanged(s: CharSequence, start: Int, before: Int, count: Int) {
        var str = s.toString().replace("[^\\d]".toRegex(), "")

        if (str.isEmpty()) {
            return
        }

        if (before == 1 && befores.isNotEmpty() && !isUpdating) {
            val last = befores.substring(befores.length, befores.length)
            val rep = last.replace("(", "").replace(")", "").replace(" ", "").replace("-", "")
            if (rep.isEmpty()) {
                str = str.substring(0, befores.length - 1)
            }
        }


        val mask = StringBuilder()
        if (isUpdating) {
            mOldString = str
            isUpdating = false
            return
        }
        var i = 0
        for (m in mMask.toCharArray()) {
            if (m != '#') {
                mask.append(m)
                continue
            }
            try {
                mask.append(str[i])
            } catch (e: Exception) {
                break
            }

            i++
        }
        isUpdating = true
        val x = mask.toString()
        editText.setText(x)
        editText.setSelection(mask.length)

    }

    override fun afterTextChanged(s: Editable) {
    }
}