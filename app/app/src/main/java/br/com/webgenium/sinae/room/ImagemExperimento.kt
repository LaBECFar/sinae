package br.com.webgenium.sinae.room

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.PrimaryKey

@Entity(foreignKeys = [
    ForeignKey(
        entity = Experimento::class,
        parentColumns = ["id"],
        childColumns = ["experimentoId"]
    )]
)
data class ImagemExperimento (
    @PrimaryKey(autoGenerate = true)
    var id: Long,

    var experimentoId: Long,

    var frame: String,

    var uploaded: Boolean = false
)