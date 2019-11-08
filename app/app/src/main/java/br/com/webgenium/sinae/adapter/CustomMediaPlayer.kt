package br.com.webgenium.sinae.adapter

import android.media.MediaPlayer

class CustomMediaPlayer : MediaPlayer {

    constructor() : super()

    override fun prepare() {
        super.prepareAsync()
    }

}