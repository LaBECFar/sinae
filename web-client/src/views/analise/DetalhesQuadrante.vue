<template>
    <div>
        <b-alert :show="msg.text" :v-show="msg.text" :variant=msg.type>
            {{ msg.text }}

            <b-button @click="back()" variant="secondary">Voltar</b-button>
        </b-alert>

        <h4>Quadrante {{ quadrante }}</h4>
        <h5>Tamanho do Raio</h5>
        <input v-model="radius" style="width: 60px; margin: 5px">
        <b-button variant="secondary" size="sm" @click="alterarRaio()" @blur="alterarRaio()">
            Alterar Raio
        </b-button>&nbsp;        
      
        <h5>Mover Poços</h5>
        
        <b-button variant="secondary" size="sm" @click="moveLeft(2)">
            <v-icon name="arrow-left"></v-icon>
        </b-button>&nbsp;
        
        <b-button variant="secondary" size="sm" @click="moveLeft(-2)">
            <v-icon name="arrow-right"></v-icon>
        </b-button>&nbsp;

        <b-button variant="secondary" size="sm" @click="moveTop(2)">
            <v-icon name="arrow-up"></v-icon>
        </b-button>&nbsp;

        <b-button variant="secondary" size="sm" @click="moveTop(-2)">
            <v-icon name="arrow-down"></v-icon>
        </b-button>&nbsp;
        <br/>
        <br/>
        <b-button @click="enviar()" variant="primary">Extrair Poços</b-button>                
        <hr/>
        <div class="insideWrapper" style="float:left">
            <img :src=frameimage class="coveredImage" id="img_frame">     
            <canvas class="canvaframe" ref="can" :width=min_width :height=min_height></canvas>
        </div>

    </div>
</template>

<script>

import {apiAnalise} from './api'
import {apiFrame} from '../frame/api'
import { fabric } from 'fabric';

export default {

    name: "DetalhesFrame",

    data() {
        return {
            circles: [
                {top: 20, left: 13, nome: ''},
                {top: 20, left: 95, nome: ''},
                {top: 20, left: 180, nome: ''},

                {top: 102, left: 13, nome: ''},
                {top: 102, left: 95, nome: ''},
                {top: 102, left: 180, nome: ''},

                {top: 185, left: 13, nome: ''},
                {top: 185, left: 95, nome: ''},
                {top: 185, left: 180, nome: ''},

                {top: 267, left: 13, nome: ''},
                {top: 267, left: 95, nome: ''},
                {top: 267, left: 180, nome: ''},

                {top: 350, left: 13, nome: ''},
                {top: 350, left: 95, nome: ''},
                {top: 350, left: 180, nome: ''},

            ],
            fill: "#ffffff",
            stroke: "#000000",
            radius: 40,
            alfa: 0.5,
            frameimage: '',
            isLoading: false,
            isBusy: false,
            quadrante: 0,
            min_height: 480,
            min_width: 270,
            ref:'',
            canvas:'',
            msg: {
                text: false,
                type: ''
            }            
        }
    },  
    methods: {   
        
        back() {
            this.$router.push(`/analise/${this.analiseCodigo}/`)
        },

        alterarRaio() {
            this.renderCircles()
        },

        moveLeft: function(e) {
            let t = this.circles.length
            for (let i = 0; i < t; i++) {
                this.circles[i].left = this.circles[i].left-parseInt(e);
            }
            this.renderCircles()
        },

        moveTop: function(e) {
            let t = this.circles.length
            for (let i = 0; i < t; i++) {
                this.circles[i].top = this.circles[i].top-parseInt(e);
            }
            this.renderCircles()
        },

        enviar: function()  {

            let myImg = document.getElementById("img_frame");

            let realWidth = myImg.naturalWidth;
            let realHeight = myImg.naturalHeight;
            
            let ratio_width = realWidth / this.min_width;
            let aux_radio = parseInt(this.radius * ratio_width)

            let aux_circle = []
            for (let i = 0; i < this.circles.length; i++) {
                let circle = this.circles[i]
            
                if (
                        circle.top <= 0 || 
                        circle.left <= 0 || 
                        (circle.top+2*this.radius >= this.min_height) ||
                        (circle.left+2*this.radius >= this.min_width)
                    ) {
                    this.msg.text = `O poço ${circle.nome} está fora da área da imagem`
                    this.msg.type = "danger"
                    return false;
                }

                let y = parseInt((circle.top / this.min_width) * realWidth) + aux_radio
                let x = parseInt((circle.left / this.min_height) * realHeight) + aux_radio


                aux_circle.push({
                    left: y,
                    top: x,
                    nome: circle.nome
                })
            }

            let dados = {
                quadrante: this.quadrante,
                raio: aux_radio,
                pocos: aux_circle
            }

            apiAnalise.extractPocos(this.analiseCodigo, dados)
                .then((data) => {
                    console.log(data)
                    this.msg.text = "Poços em processo de extração. Acompanhe quantos frames já foram processados na tela anterior"
                    this.msg.type = "success"
                })
                .catch(e => {
                    console.log(e)
                })     
        },

        refresh() {
            this.isBusy = true

            apiAnalise.getAnalise(this.analiseCodigo)
                .then((data) => {
                    this.analise = data
                    for (let i = 0; i < this.analise.idPrimeiroFrame.length; i++) {
                        let frame = this.analise.idPrimeiroFrame[i]
                        if (frame.quadrante == this.quadrante) {
                            apiFrame.getImage(frame.idFrame)
                                .then((data) => {
                                    this.frameimage = data
                                })
                                .catch(e => {
                                    console.log(e)
                                })
                        }
                    }
                    this.isBusy = false
                })
                .catch(e => {
                    console.log(e)
                    this.isBusy = false
                })            
        },

        renderCircles() {

            this.canvas.selection = false; // disable group selection
            this.canvas.clear()

            let t = this.circles.length

            for (let i = 0; i < t; i++) {
                let circle = this.circles[i]
                
                let c = new fabric.Circle({
                    id: i,
                    fill: this.fill,
                    stroke: this.stroke,
                    opacity: 0.5,
                    top: circle.top,
                    left: circle.left,
                    radius: this.radius,
                    hasControls: false
                });
                this.canvas.add(c);
            }

            this.canvas.renderAll();
        }
    },

    created() {        

        this.analiseCodigo = this.$route.params.analiseCodigo
        this.quadrante = this.$route.params.quadrante

        if (this.quadrante == 1) {
            this.circles[0].nome = "B02"
            this.circles[1].nome = "C02"
            this.circles[2].nome = "D02"
            this.circles[3].nome = "B03"
            this.circles[4].nome = "C03"
            this.circles[5].nome = "D03"
            this.circles[6].nome = "B04"
            this.circles[7].nome = "C04"
            this.circles[8].nome = "D04"
            this.circles[9].nome = "B05"
            this.circles[10].nome = "C05"
            this.circles[11].nome = "D05"            
            this.circles[12].nome = "B06"
            this.circles[13].nome = "C06"
            this.circles[14].nome = "D06"
        }

        if (this.quadrante == 2) {
            this.circles[0].nome = "B07"
            this.circles[1].nome = "C07"
            this.circles[2].nome = "D07"
            this.circles[3].nome = "B08"
            this.circles[4].nome = "C08"
            this.circles[5].nome = "D08"
            this.circles[6].nome = "B09"
            this.circles[7].nome = "C09"
            this.circles[8].nome = "D09"
            this.circles[9].nome = "B10"
            this.circles[10].nome = "C10"
            this.circles[11].nome = "D10"            
            this.circles[12].nome = "B11"
            this.circles[13].nome = "C11"
            this.circles[14].nome = "D11"
        }

        if (this.quadrante == 3) {
            this.circles[0].nome = "E07"
            this.circles[1].nome = "F07"
            this.circles[2].nome = "G07"
            this.circles[3].nome = "E08"
            this.circles[4].nome = "F08"
            this.circles[5].nome = "G08"
            this.circles[6].nome = "E09"
            this.circles[7].nome = "F09"
            this.circles[8].nome = "G09"
            this.circles[9].nome = "E10"
            this.circles[10].nome = "F10"
            this.circles[11].nome = "G10"            
            this.circles[12].nome = "E11"
            this.circles[13].nome = "F11"
            this.circles[14].nome = "G11"
        }

        if (this.quadrante == 4) {
            this.circles[0].nome = "E02"
            this.circles[1].nome = "F02"
            this.circles[2].nome = "G02"
            this.circles[3].nome = "E03"
            this.circles[4].nome = "F03"
            this.circles[5].nome = "G03"
            this.circles[6].nome = "E04"
            this.circles[7].nome = "F04"
            this.circles[8].nome = "G04"
            this.circles[9].nome = "E05"
            this.circles[10].nome = "F05"
            this.circles[11].nome = "G05"            
            this.circles[12].nome = "E06"
            this.circles[13].nome = "F06"
            this.circles[14].nome = "G06"
        }

        this.refresh()
    },

    mounted() {
        this.ref = this.$refs.can;
        this.canvas = new fabric.Canvas(this.ref);
        let that = this
        this.canvas.on('object:moved', function(options) {
            let id = parseInt(options.target.id)
            that.circles[id].top = parseInt(options.target.top)
            that.circles[id].left = parseInt(options.target.left)
        });        
        this.renderCircles()
    }
};
</script>

<style>
  .outsideWrapper {
      width:100%;
      height:100%;
      margin:20px 60px;
      border:1px solid blue;
  }
  .insideWrapper {
      width:270px;
      height:480px;
      position:relative;
  }
  .coveredImage {
      width:100%;
      height:100%;
      position:absolute;
      top:0px;
      left:0px;
  }
  .coveringCanvas {
      width:100%;
      height:100%;
      position:absolute;
      top:0px;
      left:0px;
      background-color: rgba(255, 0, 0, .1);
  }
</style>
