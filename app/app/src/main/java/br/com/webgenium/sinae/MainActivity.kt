package br.com.webgenium.sinae

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.content.Intent
import android.view.ActionMode
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.lifecycle.lifecycleScope
import kotlinx.android.synthetic.main.activity_main.*
import kotlinx.coroutines.launch
import br.com.webgenium.sinae.custom.adapter.ExperimentoAdapter
import androidx.recyclerview.widget.DividerItemDecoration
import androidx.recyclerview.widget.LinearLayoutManager
import br.com.webgenium.sinae.model.Experimento
import br.com.webgenium.sinae.database.*


class MainActivity : AppCompatActivity() {

    private var mAdapter = ExperimentoAdapter(mutableListOf())

    private val db: AppDatabase by lazy { AppDatabase(this) }
    private val dao: AppDao by lazy { db.dao() }

    private var actionMode: ActionMode? = null
    private val actionModeCallback = ActionModeCallback()

    private var experimentos: List<Experimento> = listOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupRecycler()

        btn_novo_experimento.setOnClickListener {
            novoExperimento()
        }
    }


    override fun onResume() {
        super.onResume()

        lifecycleScope.launch {
            experimentos = dao.getExperimentos()
            mAdapter.atualizar(experimentos.toMutableList())
            toggleRecyclerVisibility(experimentos.isEmpty())
        }
    }

    private fun toggleRecyclerVisibility(isVisible: Boolean) {
        if (!isVisible) {
            empty_view.visibility = TextView.GONE
            recyclerview.visibility = TextView.VISIBLE
        } else {
            recyclerview.visibility = TextView.GONE
            empty_view.visibility = TextView.VISIBLE
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        val inflater: MenuInflater = menuInflater
        inflater.inflate(R.menu.menu_main_activity, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.configuracoes -> {
                abrirConfiguracoes()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun abrirConfiguracoes() {
        val intent = Intent(this, ConfiguracoesActivity::class.java)
        startActivity(intent)
    }


    private fun novoExperimento() {
        val intent = Intent(this, NovoExperimentoActivity::class.java)
        startActivity(intent)
    }


    private fun verExperimento(codigo: String) {
        val intent = Intent(this, ExperimentoActivity::class.java)
        intent.putExtra("experimentoCodigo", codigo)
        startActivity(intent)
    }

    private fun setupRecycler() {

        val layoutManager = LinearLayoutManager(this)
        layoutManager.orientation = LinearLayoutManager.VERTICAL

        mAdapter.onItemClick = { experimento, position ->
            if (actionMode != null) {
                toggleItemSelection(position)
            } else {
                verExperimento(experimento.codigo)
            }
        }

        mAdapter.onItemLongClick = { _, position -> toggleItemSelection(position) }

        recyclerview.layoutManager = layoutManager
        recyclerview.adapter = mAdapter

        // Configurando um dividr entre linhas, para uma melhor visualização.
        recyclerview.addItemDecoration(
            DividerItemDecoration(this, DividerItemDecoration.VERTICAL)
        )
    }

    private fun checkActionMode() {
        val count = mAdapter.getSelectedItemCount()

        if (count > 0) {
            if (actionMode == null) {
                actionMode = startActionMode(actionModeCallback)
            }
            actionMode?.title = getString(R.string.experiments)
            actionMode?.subtitle = getString(R.string.x_selected, count)
        } else {
            actionMode?.finish()
        }
    }


    private fun toggleItemSelection(position: Int) {
        mAdapter.toggleSelection(position)
        checkActionMode()
    }

    private fun removerItensSelecionados() {
        val revertedSelectedPositions = mAdapter.getSelectedItems().asReversed()

        // removidos em ordem reversa para não dar erro indexoutofbounds pois após remover os itens abaixo mudam de posição
        revertedSelectedPositions.forEach { pos ->
            val experimento: Experimento = mAdapter.getItem(pos)

            lifecycleScope.launch {
                val analises = dao.getAnalises(experimento.codigo)

                analises.forEach { analise ->
                    val frames = dao.getFramesFromAnalise(analise.id)
                    frames.forEach { frame ->
                        frame.removerArquivo()
                    }
                }

                dao.deleteExperimento(experimento)
            }

            mAdapter.removerItem(experimento)
            mAdapter.notifyItemRemoved(pos)
            toggleRecyclerVisibility(mAdapter.itemCount <= 0)
        }
    }

    private fun confirmarExclusao() {
        val count = mAdapter.getSelectedItemCount()

        var msg = getString(R.string.experiment_exclude_x, count)
        if (count > 1) {
            msg = getString(R.string.experiment_exclude_x_plural, count)
        }

        val builder = AlertDialog.Builder(this)
        builder.setTitle(getString(R.string.experiment_exclude))
        builder.setMessage(msg)
        builder.setPositiveButton(getString(R.string.yes)) { _, _ ->
            removerItensSelecionados()
            actionMode?.finish()
        }
        builder.setNegativeButton(getString(R.string.no)) { _, _ -> }
        val dialog: AlertDialog = builder.create()
        dialog.show()
    }


    private inner class ActionModeCallback : ActionMode.Callback {

        override fun onCreateActionMode(mode: ActionMode, menu: Menu): Boolean {
            val inflater: MenuInflater = mode.menuInflater
            inflater.inflate(R.menu.listagem_menu, menu)
            return true
        }

        override fun onPrepareActionMode(mode: ActionMode, menu: Menu): Boolean {
            return false
        }

        override fun onActionItemClicked(mode: ActionMode, item: MenuItem): Boolean {
            return when (item.itemId) {
                R.id.remover_item -> {
                    confirmarExclusao()
                    true
                }
                else -> false
            }
        }

        override fun onDestroyActionMode(mode: ActionMode) {
            mAdapter.clearSelection()
            actionMode = null
        }
    }
}