<template>
  <div>    
    <loading :active.sync="isLoading" :is-full-page="true"></loading>      
    <b-row>
        <b-col>            
            <h2>
                <v-icon style="width: 32px;" name="layers"></v-icon>
                Experimentos
            </h2>
        </b-col>
        <b-col class="text-right">
            <b-button to="/experimento/novo" variant="success" class="mr-2">
                <v-icon name="plus"></v-icon>
                Novo
            </b-button>    
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
            <b-alert :show="msg.text" :v-show="msg.text" :variant=msg.type>
                {{ msg.text }}
            </b-alert>
        </b-col>            
    </b-row>
    <b-table
        :busy="isBusy"
        :items="items" 
        :fields="fields" 
        striped 
        responsive="sm">

      <template v-slot:cell(createdAt)="data">
          <span>{{ data.item.createdAt | moment("utc", "DD/MM/YYYY") }}</span>
      </template>

      <template v-slot:cell(actions)="row">    

        <b-button variant="success" size="sm" @click="listarAnalises(row.item)" class="mr-2">
            <v-icon name="grid"></v-icon>
            Análises
        </b-button>

        <b-button variant="primary" size="sm" @click="editarExperimento(row.item)" class="mr-2">
            <v-icon name="edit-2"></v-icon>
        </b-button>

        <b-button variant="danger" size="sm" @click="removerExperimento(row.item)" class="mr-2">
            <v-icon name="trash"></v-icon>            
        </b-button>
      </template>        

        <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
        </div>      
    </b-table>

    <b-alert 
        variant="secondary" 
        class="text-center" 
        :show=!items.length>
        Ainda não existem experimentos cadastrados
    </b-alert>

    <b-row>
        <b-col class="text-right">
            <strong>Total: {{ items.length }}</strong>
        </b-col>
    </b-row>

  </div>
</template>

<script>
import {apiExperimento} from './api'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'ExperimentoIndex',
    components: {Loading},
    data() {
        return {
            isBusy: true,
            isLoading: false,
            fields: [{
                key:'createdAt',
                label: 'Data Experimento'
            },{
                key: 'codigo',
                label: 'Código'
            },{
                key: 'label',
                label: 'Identificador'
            },{
                key:'actions',
                label: 'Ações',
                class: 'experimentoIndexActions'
            }],
            items: [],
            msg: {
                text: false,
                type: ''
            }
        }
    },
    methods: {
     
        listarAnalises (experimento) {
            this.$router.push(`/experimento/${experimento.codigo}/analises`)
        },

        editarExperimento (experimento) {
            this.$router.push(`/experimento/${experimento._id}/editar`)
        },

        removerExperimento(experimento) {
            this.$swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá desfazer isso ok!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, REMOVER o experimento!'
            }).then((result) => {
                if (result.value) {
                    apiExperimento.removeExperimento(experimento._id)
                        .then(() => {
                            this.refresh()
                        })
                        .catch(e => {
                            console.log(e)
                        })
                }
            })
        },

        refresh() {
            this.isBusy = true
            this.isLoading = false
            apiExperimento.lisatrExperimentos()
                .then((data) => {
                    this.items = data
                    this.isBusy = false
                })
                .catch(e => {
                    console.log(e)
                    this.isBusy = false
                })
        }
    },
    created() {
        this.refresh()
    }
}
</script>

<style>
    .experimentoIndexActions {
        width: 300px;
        text-align: center;
    }
</style>