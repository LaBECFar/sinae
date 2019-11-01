package br.com.webgenium.sinae.adapter

import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.recyclerview.widget.RecyclerView
import br.com.webgenium.sinae.R
import br.com.webgenium.sinae.room.ImagemExperimento
import com.squareup.picasso.Picasso
import java.io.File


class FrameAdapter(frames: List<ImagemExperimento>) :
    RecyclerView.Adapter<FrameAdapter.ViewHolder>() {

    private var mFrames: List<ImagemExperimento> = frames

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        return ViewHolder(
            LayoutInflater.from(parent.context).inflate(R.layout.frame_griditem, parent, false)
        )
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val frame = mFrames[position]
        val f = File(frame.frame)
        Picasso.get().load(f).resize(0, 100).into(holder.imagem)
        // holder.imagem.setImageURI(Uri.parse(frame.frame))
    }


    override fun getItemCount(): Int {
        return mFrames.size
    }


    fun atualizar(frames: List<ImagemExperimento>) {
        this.mFrames = frames
        notifyDataSetChanged()
    }


    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        var imagem: ImageView = itemView.findViewById(R.id.imagem)
    }
}