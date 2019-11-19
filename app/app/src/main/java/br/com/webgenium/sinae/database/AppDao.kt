package br.com.webgenium.sinae.database

import androidx.room.*
import br.com.webgenium.sinae.model.Analise
import br.com.webgenium.sinae.model.Experimento
import br.com.webgenium.sinae.model.Frame


@Dao
interface AppDao {

    /* Experimento */
    @Query("SELECT * FROM Experimento ORDER BY dataCriacao DESC")
    suspend fun getExperimentos(): List<Experimento>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExperimento(experimento: Experimento): Long

    @Update
    suspend fun updateExperimento(experimento: Experimento)

    @Delete
    suspend fun deleteExperimento(experimento: Experimento)

    @Query("SELECT * FROM Experimento WHERE codigo = :experimentoCodigo LIMIT 1")
    suspend fun getExperimentoByCodigo(experimentoCodigo: String): Experimento?


    /* Analise */
    @Query("SELECT * FROM Analise WHERE experimentoCodigo = :experimentoCodigo ORDER BY id")
    suspend fun getAnalises(experimentoCodigo: String): List<Analise>

    @Query("SELECT * FROM Frame WHERE analiseId = :analiseId")
    suspend fun getFramesFromAnalise(analiseId: Long): List<Frame>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnalise(analise: Analise): Long

    @Delete
    suspend fun deleteAnalise(analise: Analise)

    @Query("SELECT * FROM Analise WHERE id = :analiseId LIMIT 1")
    suspend fun getAnaliseById(analiseId: Long): Analise?



    /* Frame */
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFrame(vararg image: Frame)

    @Delete
    suspend fun deleteFrame(imagem: Frame)
}