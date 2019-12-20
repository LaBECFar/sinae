package br.com.webgenium.sinae.custom.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.model.Analise


class AnaliseAdapter(analises: MutableList<Analise>) : SelectableAdapter<AnaliseAdapter.ViewHolder>() {

    private var mAnalises: MutableList<Analise> = analises

    var onItemClick: ( (Analise, Int) -> Unit )? = null
    var onItemLongClick: ( (Analise, Int) -> Unit )? = null

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.analise_listitem, parent, false)
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val analise = mAnalises[position]
        holder.titulo.text = analise.tempo
        holder.placa.text = analise.placa

        if(isSelected(position)) {
            holder.item.setBackgroundColor(Color.parseColor("#cccccc"))
        } else {
            holder.item.setBackgroundColor(Color.parseColor("#eeeeee"))
        }
    }


    override fun getItemCount(): Int {
        return mAnalises.size
    }


    fun atualizar(analises: MutableList<Analise>){
        this.mAnalises = analises
        notifyDataSetChanged()
    }

    fun getItem(position: Int): Analise {
        return mAnalises[position]
    }

    fun removerItem(analise: Analise){
        mAnalises.remove(analise)
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val titulo: TextView = itemView.findViewById(R.id.titulo)
        val placa: TextView = itemView.findViewById(R.id.placa)
        val item: View = itemView.findViewById(R.id.listitem)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mAnalises[adapterPosition], adapterPosition)
            }

            itemView.setOnLongClickListener {
                onItemLongClick?.invoke(mAnalises[adapterPosition], adapterPosition)
                true
            }
        }
    }
}