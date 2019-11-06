package br.com.webgenium.sinae.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.Experimento


class ExperimentoAdapter(experimentos: List<Experimento>) : RecyclerView.Adapter<ExperimentoAdapter.ViewHolder>() {

    private var mExperimentos: List<Experimento> = experimentos
    var onItemClick: ( (Experimento) -> Unit )? = null


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.experimento_listitem, parent, false)
        )
    }


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val experimento = mExperimentos[position]
        holder.titulo.text =  experimento.label
        holder.codigo.text = experimento.codigo
    }


    override fun getItemCount(): Int {
        return mExperimentos.size
    }


    fun changeExperimentos(experimentos: List<Experimento>){
        this.mExperimentos = experimentos
        notifyDataSetChanged()
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        var titulo: TextView = itemView.findViewById(R.id.titulo)
        var codigo: TextView = itemView.findViewById(R.id.codigo)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mExperimentos[adapterPosition])
            }
        }

    }
}