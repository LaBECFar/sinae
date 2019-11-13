package br.com.webgenium.sinae.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.io.Serializable

@Entity
class Experimento : Serializable{

    @PrimaryKey(autoGenerate = true)
    var id: Long = 0

    var codigo: String = ""

    var label: String? = ""
}