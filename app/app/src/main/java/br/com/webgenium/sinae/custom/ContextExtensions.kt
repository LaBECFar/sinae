package br.com.webgenium.sinae.custom

import android.content.Context
import android.graphics.Color
import android.view.Gravity
import android.widget.TextView
import android.widget.Toast

fun Context.toast(message: CharSequence, type: String = "") {
     val toast =  Toast.makeText(this, message, Toast.LENGTH_SHORT)
     toast.setGravity(Gravity.BOTTOM or Gravity.FILL_HORIZONTAL, 0, 0)


     if(type.isNotEmpty()) {
          if(type == "error") {
               toast.view.setBackgroundColor(Color.parseColor("#bb4141"))
               val text = toast.view.findViewById(android.R.id.message) as TextView
               text.setTextColor(Color.WHITE)
          }
     } else {
          toast.view.setBackgroundColor(Color.parseColor("#99000000"))
          val text = toast.view.findViewById(android.R.id.message) as TextView
          text.setTextColor(Color.WHITE)
     }

     toast.show()
}