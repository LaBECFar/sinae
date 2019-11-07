package br.com.webgenium.sinae.adapter

import android.content.Context
import android.util.AttributeSet
import android.widget.MediaController
import androidx.appcompat.view.ContextThemeWrapper
import br.com.webgenium.sinae.R

class CustomMediaController : MediaController {
    constructor(context: Context, attrs: AttributeSet) : super(ContextThemeWrapper(context, R.style.AppPlayer), attrs)

    constructor(context: Context, useFastForward: Boolean) : super(ContextThemeWrapper(context, R.style.AppPlayer), useFastForward)

    constructor(context: Context) : super(ContextThemeWrapper(context, R.style.AppPlayer))

    override fun show(timeout: Int) {
        super.show(0)
    }

    override fun hide() {

    }

}