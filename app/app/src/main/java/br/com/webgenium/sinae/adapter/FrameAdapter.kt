package br.com.webgenium.sinae.adapter

import android.annotation.SuppressLint
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.ImagemExperimento


class FrameAdapter(frames: MutableList<ImagemExperimento>) : SelectableAdapter<FrameAdapter.ViewHolder>() {

    private var mFrames: MutableList<ImagemExperimento> = frames

    var onItemClick: ( (ImagemExperimento, Int) -> Unit )? = null
    var onItemLongClick: ( (ImagemExperimento, Int) -> Unit )? = null


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.frame_listitem, parent, false)
        )
    }


    @SuppressLint("SetTextI18n")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.titulo.text = "Frame "+ (position + 1)

        if(isSelected(position)) {
            holder.item.setBackgroundColor(Color.parseColor("#cccccc"))
        } else {
            holder.item.setBackgroundColor(Color.parseColor("#eeeeee"))
        }
    }


    override fun getItemCount(): Int {
        return mFrames.size
    }


    fun atualizar(frames: MutableList<ImagemExperimento>){
        this.mFrames = frames
        notifyDataSetChanged()
    }

    fun getItem(position: Int): ImagemExperimento {
        return mFrames[position]
    }

    fun removerItem(frame: ImagemExperimento){
        mFrames.remove(frame)
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        var titulo: TextView = itemView.findViewById(R.id.titulo)
        val item: View = itemView.findViewById(R.id.listitem)

        init {
            itemView.setOnClickListener {
                onItemClick?.invoke(mFrames[adapterPosition], adapterPosition)
            }

            itemView.setOnLongClickListener {
                onItemLongClick?.invoke(mFrames[adapterPosition], adapterPosition)
                true
            }
        }
    }
}