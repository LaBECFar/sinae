package br.com.webgenium.sinae.custom

import android.app.Activity
import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.view.View
import android.view.inputmethod.InputMethodManager
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import br.com.webgenium.sinae.R


const val TOAST_SUCCESS = "success"
const val TOAST_ERROR = "error"

fun Context.toast(message: CharSequence, type: String = "") {
     val toast =  Toast.makeText(this, message, Toast.LENGTH_SHORT)
     toast.setGravity(Gravity.BOTTOM or Gravity.FILL_HORIZONTAL, 0, 0)


     var bgcolor = "#" + Integer.toHexString(ContextCompat.getColor(this, R.color.toastBackground))

     if(type.isNotEmpty()) {
          if(type == TOAST_ERROR) {
               bgcolor = "#"+Integer.toHexString(ContextCompat.getColor(this, R.color.toastBackgroundError))


          }

          if(type == TOAST_SUCCESS) {
               bgcolor = "#"+Integer.toHexString(ContextCompat.getColor(this, R.color.toastBackgroundSuccess))
          }
     }

     toast.view.setBackgroundColor(Color.parseColor(bgcolor))
     val text = toast.view.findViewById(android.R.id.message) as TextView
     text.setTextColor(Color.WHITE)
     toast.setMargin(0f,0f)
     toast.show()
}


fun Activity.hideKeyboard() {
     hideKeyboard(currentFocus ?: View(this))
}


fun Context.hideKeyboard(view: View) {
     val inputMethodManager = getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager
     inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
}