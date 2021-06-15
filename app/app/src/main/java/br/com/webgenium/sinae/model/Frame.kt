package br.com.webgenium.sinae.model

import android.net.Uri
import android.util.Log
import androidx.room.*
import java.io.File

@Entity(foreignKeys = [
    ForeignKey(
        entity = Analise::class,
        parentColumns = ["id"],
        childColumns = ["analiseId"],
        onDelete = ForeignKey.CASCADE
    )]
)
class Frame {
    @PrimaryKey(autoGenerate = true)
    var id: Long = 0

    @ColumnInfo(index = true)
    var analiseId: Long = 0

    var uri: String = ""

    var uploaded: Boolean = false

    var filename: String = ""

    var tempoMilis: Long = 0

    var quadrante: Int = 0

    fun removerArquivo(): Boolean{
        val filePath = Uri.parse(this.uri).path
        filePath?.let{ filePath ->
            val file = File(filePath)
            if(file.exists()){
                try {
                    file.delete()
                } catch (e: Exception){
                    //Log.e("ExperimentoActivity", "Não foi possível excluir o arquivo: "+e.message)
                    return false
                }
            }
        }
        return true
    }
}