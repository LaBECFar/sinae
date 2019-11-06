package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.activity_frame.*
import java.io.File

class FrameActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_frame)

        val imageSrc = intent.getStringExtra("imageSrc")

        val f = File(imageSrc)
        Picasso.get().load(f).into(imageview)
    }
}
