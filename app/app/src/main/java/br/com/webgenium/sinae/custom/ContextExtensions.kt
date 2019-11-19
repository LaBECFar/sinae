package br.com.webgenium.sinae.custom

import android.content.Context
import android.widget.Toast

fun Context.toast(message: CharSequence) {
     val toast = Toast.makeText(this, message, Toast.LENGTH_SHORT)
     toast.show()
}