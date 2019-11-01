package br.com.webgenium.sinae.room

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AppDao {

    /*
        Experimento
    */

    @Query("SELECT * FROM Experimento ORDER BY id DESC")
    fun getExperimentos(): Flow<List<Experimento>>


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertExperimento(experimento: Experimento): Long


    @Update
    suspend fun updateExperimento(experimento: Experimento)


    @Delete
    suspend fun deleteExperimento(experimento: Experimento)


    @Query("SELECT * FROM Experimento WHERE id = :experimentoId LIMIT 1")
    fun getExperimentoById(experimentoId: Long): Flow<Experimento>?


    @Query("SELECT * FROM Experimento WHERE codigo = :experimentoCodigo LIMIT 1")
    fun getExperimentoByCodigo(experimentoCodigo: Long): Flow<Experimento>?



    /*
        Analise
    */

    @Query("SELECT * FROM Analise WHERE experimentoId = :experimentoId ORDER BY id")
    fun getAnalises(experimentoId: Long): Flow<List<Analise>>


    @Query("SELECT * FROM ImagemExperimento WHERE analiseId = :analiseId")
    fun getFramesFromAnalise(analiseId: Long): Flow<List<ImagemExperimento>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAnalise(analise: Analise): Long

    @Delete
    suspend fun deleteAnalise(analise: Analise)



    /*
        ImagemExperimento
    */

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertImage(vararg image: ImagemExperimento)


}