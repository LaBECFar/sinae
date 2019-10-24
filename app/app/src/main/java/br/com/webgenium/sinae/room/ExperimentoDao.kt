package br.com.webgenium.sinae.room

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ExperimentoDao {
    @Query("SELECT * FROM Experimento")
    fun all(): Flow<List<Experimento>>


    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(vararg experimento: Experimento)


    @Update
    suspend fun update(experimento: Experimento)


    @Delete
    suspend fun delete(experimento: Experimento)


    @Query("SELECT * FROM Experimento WHERE id = :experimentoId LIMIT 1")
    fun getById(experimentoId: Int): Flow<Experimento>?


    @Query("SELECT * FROM Experimento WHERE codigo = :experimentoCodigo LIMIT 1")
    fun getByCodigo(experimentoCodigo: Int): Flow<Experimento>?


    @Query("SELECT * FROM ImagemExperimento WHERE experimentoId = :experimentoId")
    suspend fun getImagesFromExperimento(experimentoId: Int): List<ImagemExperimento>
}