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

    @Ignore
    var experimento: Experimento? = null

    @Ignore
    var frames: List<Frame> = listOf()
}