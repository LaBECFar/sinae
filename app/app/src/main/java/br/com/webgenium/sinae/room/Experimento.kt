package br.com.webgenium.sinae.room

import androidx.annotation.NonNull
import androidx.room.Entity
import androidx.room.Ignore
import androidx.room.PrimaryKey

@Entity
data class Experimento (

    @PrimaryKey(autoGenerate = true)
    var id: Int,

    var codigo: String,

    var tempo: String?,

    var label: String?,

    var fps: Int = 1
)