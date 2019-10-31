package br.com.webgenium.sinae.room

import androidx.room.*

@Entity(foreignKeys = [
    ForeignKey(
        entity = Experimento::class,
        parentColumns = ["id"],
        childColumns = ["testeId"]
    )]
)
class ImagemExperimento {
    @PrimaryKey(autoGenerate = true)
    var id: Long = 0

    @ColumnInfo(index = true)
    var testeId: Long = 0

    var frame: String = ""

    var uploaded: Boolean = false
}