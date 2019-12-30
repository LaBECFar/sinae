package br.com.webgenium.sinae.api

import br.com.webgenium.sinae.model.Frame


class FrameResponse {
    var _id: String = ""
    var analiseId: String = ""
    var url: String = ""
    var tempoMilis: Long = 0
    var quadrante: Int = 0

    fun toFrame() : Frame {
        val frame = Frame()
        frame.tempoMilis = tempoMilis
        frame.uri = url
        frame.uploaded = true
        frame.quadrante = quadrante
        return frame
    }
}