package br.com.webgenium.sinae.room

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ExperimentoDao {
    @Query("SELECT * FROM Experimento ORDER BY id DESC")
    fun all(): Flow<List<Experimento>>


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(experimento: Experimento): Long


    @Update
    suspend fun update(experimento: Experimento)


    @Delete
    suspend fun delete(experimento: Experimento)


    @Query("SELECT * FROM Experimento WHERE id = :experimentoId LIMIT 1")
    fun getById(experimentoId: Long): Flow<Experimento>?


    @Query("SELECT * FROM Experimento WHERE codigo = :experimentoCodigo LIMIT 1")
    fun getByCodigo(experimentoCodigo: Long): Flow<Experimento>?


    @Query("SELECT * FROM ImagemExperimento WHERE experimentoId = :experimentoId")
    fun getFramesFromExperimento(experimentoId: Long): Flow<List<ImagemExperimento>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertImage(vararg image: ImagemExperimento)
}