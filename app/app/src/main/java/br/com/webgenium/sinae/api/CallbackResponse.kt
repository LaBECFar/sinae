package br.com.webgenium.sinae.api

interface CallbackResponse<T> {
    fun success(response: T)
}