package br.com.webgenium.sinae.api

import br.com.webgenium.sinae.model.Frame


class FrameResponse {
    var _id: String = ""
    var analiseId: String = ""
    var url: String = ""
    var tempoMilis: Long = 0

    fun toFrame() : Frame {
        val frame = Frame()
        frame.tempoMilis = tempoMilis
        frame.uri = url
        frame.uploaded = true
        return frame
    }
}