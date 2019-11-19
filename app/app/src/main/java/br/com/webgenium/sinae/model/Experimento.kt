package br.com.webgenium.sinae.model

import androidx.annotation.NonNull
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.io.Serializable
import java.util.*

@Entity
class Experimento : Serializable {
    @PrimaryKey
    @NonNull
    var codigo: String = ""

    var label: String? = ""

    var dataCriacao: Date = Date(System.currentTimeMillis())
}