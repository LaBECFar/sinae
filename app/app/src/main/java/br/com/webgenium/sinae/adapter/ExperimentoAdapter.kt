package br.com.webgenium.sinae.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.Experimento


class ExperimentoAdapter(experimentos: MutableList<Experimento>) : SelectableAdapter<ExperimentoAdapter.ViewHolder>() {

    private var mExperimentos: MutableList<Experimento> = experimentos

    var onItemClick: ( (Experimento, Int) -> Unit )? = null
    var onItemLongClick: ( (Experimento, Int) -> Unit )? = null


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.experimento_listitem, parent, false)
        )
    }


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val experimento = mExperimentos[position]
        holder.titulo.text =  experimento.label
        holder.codigo.text = experimento.codigo

        if(isSelected(position)) {
            holder.item.setBackgroundColor(Color.parseColor("#cccccc"))
        } else {
            holder.item.setBackgroundColor(Color.parseColor("#eeeeee"))
        }
    }


    override fun getItemCount(): Int {
        return mExperimentos.size
    }


    fun atualizar(analises: MutableList<Experimento>){
        this.mExperimentos = analises
        notifyDataSetChanged()
    }


    fun getItem(position: Int): Experimento {
        return mExperimentos[position]
    }


    fun removerItem(analise: Experimento){
        mExperimentos.remove(analise)
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        var titulo: TextView = itemView.findViewById(R.id.titulo)
        var codigo: TextView = itemView.findViewById(R.id.codigo)
        val item: View = itemView.findViewById(R.id.listitem)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mExperimentos[adapterPosition], adapterPosition)
            }

            itemView.setOnLongClickListener {
                onItemLongClick?.invoke(mExperimentos[adapterPosition], adapterPosition)
                true
            }
        }
    }
}