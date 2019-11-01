package br.com.webgenium.sinae.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.Analise


class AnaliseAdapter(analises: List<Analise>) : RecyclerView.Adapter<AnaliseAdapter.ViewHolder>() {

    private var mAnalises: List<Analise> = analises

    var onItemClick: ( (Analise) -> Unit )? = null


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.analise_listitem, parent, false)
        )
    }


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val analise = mAnalises[position]
        holder.titulo.text = analise.tempo
    }


    override fun getItemCount(): Int {
        return mAnalises.size
    }


    fun atualizar(analises: List<Analise>){
        this.mAnalises = analises
        notifyDataSetChanged()
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        var titulo: TextView = itemView.findViewById(R.id.titulo)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mAnalises[adapterPosition])
            }
        }

    }
}