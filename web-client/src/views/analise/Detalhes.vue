<template>
  <div>    
    <loading :active.sync="isLoading" :is-full-page="true"></loading>      
    <b-row>
        <b-col>            
            <h2>
                <v-icon style="width: 32px;" name="grid"></v-icon>
                Detalhes da Análise
            </h2>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
            <b-alert :show="msg.text" :v-show="msg.text" :variant=msg.type>
                {{ msg.text }}
            </b-alert>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
                <strong>Data Coleta: </strong>                
                <span>{{ analise.dataColeta | moment("utc", "DD/MM/YYYY") }}</span>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
                <strong>Tempo: </strong>                
                <span>{{ analise.tempo }}</span>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
                <strong>Placa: </strong>                
                <span>{{ analise.placa }}</span>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
                <strong>Total de Frames: </strong>
                <span>{{ analise.frames_total }}</span>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
                <strong>Frames já Processados: </strong>
                <span>{{ analise.frames_processados }}</span>
        </b-col>
    </b-row>

  </div>
</template>

<script>
import {apiAnalise} from './api'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'AnaliseDetalhes',
    components: {Loading},
    data() {
        return {
            isBusy: true,
            isLoading: false,
            analiseCodigo: '',
            analise: [],
            msg: {
                text: false,
                type: ''
            }
        }
    },
    methods: {     
        refresh() {
            this.isBusy = true
            this.isLoading = false
            apiAnalise.getAnalise(this.analiseCodigo)
                .then((data) => {
                    this.analise = data
                    this.isBusy = false
                })
                .catch(e => {
                    console.log(e)
                    this.isBusy = false
                })
        }
    },
    created() {        
        this.analiseCodigo = this.$route.params.analiseCodigo
        this.refresh()
    }
}
</script>

<style>
</style>