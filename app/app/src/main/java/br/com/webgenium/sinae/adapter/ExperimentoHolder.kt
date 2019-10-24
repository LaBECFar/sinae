package br.com.webgenium.sinae.adapter

import android.view.View
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R

class ExperimentoHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

    var codigo: TextView = itemView.findViewById(R.id.txt_codigo)

}