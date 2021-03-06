<template>
  <div>    
    <loading :active.sync="isLoading" :is-full-page="true"></loading>      
    <b-row>
        <b-col>            
            <h2>
                <v-icon style="width: 32px;" name="grid"></v-icon>
                Análises do Experimento <strong>{{experimentoCodigo}}</strong>
            </h2>
        </b-col>
        <b-col class="text-right">
            <b-button :to="'/experimento/'+experimentoCodigo+'/analises/novo'" variant="success" class="mr-2">
                <v-icon name="plus"></v-icon>
                Novo
            </b-button>    
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
            <b-alert show v-show="msg.text" :variant="msg.type">
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

      <template v-slot:cell(dataColeta)="data">
          <span>{{ data.item.dataColeta | moment("utc", "DD/MM/YYYY") }}</span>
      </template>

      <template v-slot:cell(actions)="row">    

        <b-button variant="secondary" size="sm" @click="detalhesAnalise(row.item)" class="mr-2">
            <v-icon name="align-justify"></v-icon>
            Detalhes
        </b-button>

        <b-button variant="info" size="sm" @click="downloadMotilityResults(row.item)" class="mr-2" v-show="row.item.pocosProcessados.length >= 60">
            <v-icon name="download"></v-icon>
        </b-button>

        <b-button variant="danger" size="sm" @click="removerAnalise(row.item)" class="mr-2">
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
        Ainda não existem análises cadastradas
    </b-alert>

    <b-row>
        <b-col class="text-right">
            <strong>Total: {{ items.length }}</strong>
        </b-col>
    </b-row>

  </div>
</template>

<script>
import {apiAnalise} from './api'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'AnaliseIndex',
    components: {Loading},
    data() {
        return {
            isBusy: true,
            isLoading: false,
            experimentoCodigo: 'abx',
            fields: [{
                key: 'dataColeta',
                label: 'Data da Coleta'
            },{
                key:'tempo',
                label: 'Tempo'
            },{
                key: 'placa',
                label: 'Placa'
            },{
                key:'actions',
                label: 'Ações',
                class: 'analiseIndexActions'
            }],
            items: [],
            msg: {
                text: false,
                type: ''
            }
        }
    },
    methods: {
     
        editarAnalise (experimento) {
            this.$router.push(`/analise/${experimento._id}/editar`)
        },
     
        detalhesAnalise (analise) {
            this.$router.push(`/analise/${analise._id}`)
        },

        downloadMotilityResults(analise) {
			let url = apiAnalise.getMotilityResultsLink(analise._id)
			window.open(url, "_blank")
		},

        removerAnalise(analise) {
            this.$swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá desfazer isso ok!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, remover análise!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    apiAnalise.removerAnalise(analise._id)
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
            apiAnalise.listarAnalises(this.experimentoCodigo)
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
        this.experimentoCodigo = this.$route.params.experimentoCodigo
        this.refresh()
    }
}
</script>

<style>
    .analiseIndexActions {
        width: 250px;
        text-align: center;
    }
</style>