package br.com.webgenium.sinae.room

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.io.Serializable

@Entity
class Experimento : Serializable{

    @PrimaryKey(autoGenerate = true)
    var id: Long = 0

    var codigo: String = ""

    //var tempo: String? = ""

    var label: String? = ""

    //var fps: Int = 1

    //var quadrantes: List<String> = listOf()
}