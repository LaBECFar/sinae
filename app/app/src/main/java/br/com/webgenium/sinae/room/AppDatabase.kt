package br.com.webgenium.sinae.room

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import br.com.webgenium.sinae.model.Analise
import br.com.webgenium.sinae.model.Experimento
import br.com.webgenium.sinae.model.Frame

@Database(
    entities = [Experimento::class, Frame::class, Analise::class],
    version = 13
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase(){
    abstract fun dao(): AppDao

    // singleton
    companion object {
        @Volatile private var instance: AppDatabase? = null
        private val LOCK = Any()

        operator fun invoke(context: Context)= instance ?: synchronized(LOCK){
            instance ?: buildDatabase(context).also { instance = it}
        }

        private fun buildDatabase(context: Context) = Room.databaseBuilder(context, AppDatabase::class.java, "sinae.db").fallbackToDestructiveMigration().build()
    }
}