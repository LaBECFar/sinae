package br.com.webgenium.sinae.adapter

import android.content.Context
import android.util.AttributeSet
import android.util.Log
import android.view.View
import android.widget.LinearLayout
import android.widget.MediaController
import androidx.appcompat.view.ContextThemeWrapper
import androidx.core.content.ContextCompat
import br.com.webgenium.sinae.R
import java.lang.Exception
import android.view.MotionEvent


class CustomMediaController : MediaController {
    constructor(context: Context, attrs: AttributeSet) : super(ContextThemeWrapper(context, R.style.AppPlayer), attrs)

    constructor(context: Context, useFastForward: Boolean) : super(ContextThemeWrapper(context, R.style.AppPlayer), useFastForward)

    constructor(context: Context) : super(ContextThemeWrapper(context, R.style.AppPlayer))

    //override fun show(timeout: Int) = super.show(0)

    override fun hide() {

    }

    fun hide(force: Boolean){
        if(force) {
            super.hide()
        }
    }

    fun setAnchorView(view: View?, context: Context) {
        super.setAnchorView(view)

        try {
            val viewGroupLevel1: LinearLayout = this.getChildAt(0) as LinearLayout
            viewGroupLevel1.setBackgroundColor(
                ContextCompat.getColor( context,  R.color.AlmostTransparent )
            )
        } catch (e: Exception) {
            Log.e( "SINAE", "Não foi possível deixar o MediaController do vídeo transparente" )
        }
    }

}