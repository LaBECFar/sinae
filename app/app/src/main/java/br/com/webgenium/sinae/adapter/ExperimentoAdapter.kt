package br.com.webgenium.sinae.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.Experimento


class ExperimentoAdapter(experimentos: List<Experimento>) : RecyclerView.Adapter<ExperimentoHolder>() {

    private var mExperimentos: List<Experimento> = experimentos

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ExperimentoHolder {
        return ExperimentoHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.experimento_listitem, parent, false)
        )
    }

    override fun onBindViewHolder(holder: ExperimentoHolder, position: Int) {
        holder.codigo.text = mExperimentos.get(index = position).codigo
    }

    override fun getItemCount(): Int {
        return mExperimentos.size
    }



    /*fun updateList(experimento: Experimento) {
        insertItem(experimento)
    }*/

    // Método responsável por inserir um novo usuário na lista
    //e notificar que há novos itens.
    /*private fun insertItem(experimento: Experimento) {
        mExperimentos += experimento
        notifyItemInserted(itemCount)
    }*/

    // Método responsável por atualizar um usuário já existente na lista.
    /*private fun updateItem(position: Int) {
        val experimento = mExperimentos.get(position)
        experimento.incrementAge()
        notifyItemChanged(position)
    }*/

    // Método responsável por remover um usuário da lista.
    /*private fun removerItem(position: Int) {
        mExperimentos -= mExperimentos.get(position)
        notifyItemRemoved(position)
        notifyItemRangeChanged(position, mExperimentos.size)
    }*/

}