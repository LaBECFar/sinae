package br.com.webgenium.sinae.room

import androidx.room.*

@Entity(foreignKeys = [
    ForeignKey(
        entity = Experimento::class,
        parentColumns = ["id"],
        childColumns = ["analiseId"]
    )]
)
class ImagemExperimento {
    @PrimaryKey(autoGenerate = true)
    var id: Long = 0

    @ColumnInfo(index = true)
    var analiseId: Long = 0

    var frame: String = ""

    var uploaded: Boolean = false
}