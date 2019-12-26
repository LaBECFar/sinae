package br.com.webgenium.sinae.custom

import android.content.Context
import android.graphics.Color
import android.util.Log
import android.view.Gravity
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import br.com.webgenium.sinae.R

fun Context.toast(message: CharSequence, type: String = "") {
     val toast =  Toast.makeText(this, message, Toast.LENGTH_SHORT)
     toast.setGravity(Gravity.BOTTOM or Gravity.FILL_HORIZONTAL, 0, 0)


     var bgcolor = "#" + Integer.toHexString(ContextCompat.getColor(this, R.color.toastBackground))

     if(type.isNotEmpty()) {
          if(type == "error") {
               bgcolor = "#"+Integer.toHexString(ContextCompat.getColor(this, R.color.toastBackgroundError))


          }

          if(type == "success") {
               bgcolor = "#"+Integer.toHexString(ContextCompat.getColor(this, R.color.toastBackgroundSuccess))
          }
     }

     toast.view.setBackgroundColor(Color.parseColor(bgcolor))
     val text = toast.view.findViewById(android.R.id.message) as TextView
     text.setTextColor(Color.WHITE)

     toast.show()
}