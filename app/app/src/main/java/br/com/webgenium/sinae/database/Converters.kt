package br.com.webgenium.sinae.database

import androidx.room.TypeConverter
import java.util.*


class Converters {

    @TypeConverter
    fun fromArray(strings: List<String>): String {
        var string = ""
        for (s in strings) {
            string += "$s;"
        }

        return string
    }

    @TypeConverter
    fun toArray( concatenatedStrings: String) : List<String> {
        var myStrings : List<String> = listOf()

        concatenatedStrings.split(";")

        for (s in concatenatedStrings){
            myStrings += s.toString()
        }

        return myStrings
    }


    @TypeConverter
    fun toDate(dateLong: Long?): Date? {
        return if (dateLong == null) null else Date(dateLong)
    }

    @TypeConverter
    fun fromDate(date: Date?): Long? {
        return (if (date == null) null else date!!.time)?.toLong()
    }


}

