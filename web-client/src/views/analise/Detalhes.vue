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
                <span>{{ analise.framesTotal }}</span>
                <a v-if="analise.framesTotal > 0" :href="framesDownloadLink" class="link-download">[ Download de Frames ]</a>
        </b-col>
    </b-row>
    <b-row>
        <b-col>            
                <strong>Frames já Processados: </strong>
                <span>{{ analise.framesProcessados }}</span>
                <a v-if="analise.framesProcessados > 0" :href="pocosDownloadLink" class="link-download">[ Download de Poços ]</a>
        </b-col>
    </b-row>
    <hr>
    <h4>Quadrantes</h4>
    <b-row>
        <b-col>            
                <strong>Q1: </strong>
                <span>{{ analise.frameQuadrante[1].qtd }}</span> / <span>{{ analise.frameQuadrante[1].processados }}</span> 
                <br/>
                <b-button @click="detalhesQuadrante(1)" variant="secondary">Extrair Poços</b-button>                
        </b-col>
        <b-col>            
                <strong>Q2: </strong>
                <span>{{ analise.frameQuadrante[2].qtd }}</span> / <span>{{ analise.frameQuadrante[2].processados }}</span> 
                <br/>
                <b-button @click="detalhesQuadrante(2)" variant="secondary">Extrair Poços</b-button>                
        </b-col>
        <b-col>            
                <strong>Q3: </strong>
                <span>{{ analise.frameQuadrante[3].qtd }}</span> / <span>{{ analise.frameQuadrante[3].processados }}</span> 
                <br/>
                <b-button @click="detalhesQuadrante(3)" variant="secondary">Extrair Poços</b-button>                
        </b-col>
        <b-col>            
                <strong>Q4: </strong>
                <span>{{ analise.frameQuadrante[4].qtd }}</span> / <span>{{ analise.frameQuadrante[4].processados }}</span> 
                <br/>
                <b-button @click="detalhesQuadrante(4)" variant="secondary">Extrair Poços</b-button>                
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
            },
            framesDownloadLink: '',
            pocosDownloadLink: ''
        }
    },
    methods: {     
        detalhesQuadrante(quadrante) {
            this.$router.push(`/analise/${this.analise._id}/quadrante/${quadrante}`)
        },
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
        this.framesDownloadLink = apiAnalise.getFramesDownloadLink(this.analiseCodigo)
        this.pocosDownloadLink = apiAnalise.getPocosDownloadLink(this.analiseCodigo)

        this.refresh()
    }
}
</script>

<style>
    .link-download {margin-left:10px;}
</style>