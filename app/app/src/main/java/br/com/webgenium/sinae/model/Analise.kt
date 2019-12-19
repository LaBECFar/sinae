package br.com.webgenium.sinae.model

import androidx.room.*
import java.io.Serializable

@Entity(foreignKeys = [
    ForeignKey(
        entity = Experimento::class,
        parentColumns = ["codigo"],
        childColumns = ["experimentoCodigo"],
        onDelete = ForeignKey.CASCADE
    )]
)
class Analise : Serializable {

    @PrimaryKey(autoGenerate = true)
    var id: Long = 0

    @ColumnInfo(index = true)
    var experimentoCodigo: String = ""

    var tempo: String? = ""

    var fps: Int = 1

    var quadrantes: List<String> = listOf()

    var idserver: String = ""

    var placa: String = ""

    @Ignore
    var experimento: Experimento? = null

    @Ignore
    var frames: MutableList<Frame> = mutableListOf()

    fun getFrameById(id: Long) : Frame? {
        frames.forEach {
            if(it.id == id){
                return it
            }
        }
        return null
    }

}