package br.com.webgenium.sinae.adapter

import android.annotation.SuppressLint
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.ImagemExperimento


class FrameAdapter(frames: List<ImagemExperimento>) :
    RecyclerView.Adapter<FrameAdapter.ViewHolder>() {

    private var mFrames: List<ImagemExperimento> = frames
    var onItemClick: ( (ImagemExperimento) -> Unit )? = null


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.frame_listitem, parent, false)
        )
    }

    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val frame = mFrames[position]
        holder.titulo.text = "Frame "+ (position + 1)
    }


    override fun getItemCount(): Int {
        return mFrames.size
    }


    fun atualizar(frames: List<ImagemExperimento>) {
        this.mFrames = frames
        notifyDataSetChanged()
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        var titulo: TextView = itemView.findViewById(R.id.titulo)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mFrames[adapterPosition])
            }
        }
    }
}