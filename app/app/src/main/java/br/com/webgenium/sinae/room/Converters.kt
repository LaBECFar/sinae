package br.com.webgenium.sinae.room

import androidx.room.TypeConverter

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


}

