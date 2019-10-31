package br.com.webgenium.sinae.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.TesteExperimento


class TesteAdapter(testes: List<TesteExperimento>) : RecyclerView.Adapter<TesteAdapter.ViewHolder>() {

    private var mTestes: List<TesteExperimento> = testes

    var onItemClick: ( (TesteExperimento) -> Unit )? = null


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.teste_listitem, parent, false)
        )
    }


    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val testeExperimento = mTestes[position]
        holder.titulo.text = testeExperimento.tempo
    }


    override fun getItemCount(): Int {
        return mTestes.size
    }


    fun changeExperimentos(testes: List<TesteExperimento>){
        this.mTestes = testes
        notifyDataSetChanged()
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {

        var titulo: TextView = itemView.findViewById(R.id.titulo)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mTestes[adapterPosition])
            }
        }

    }
}