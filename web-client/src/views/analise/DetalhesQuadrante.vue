<template>
    <div>
        <!-- <div class="insideWrapper" style="float:left">
            <img :src=frameimage class="coveredImage" id="img_frame">        
            <fabric-canvas name="canvaframe" class="coveringCanvas" :width=300 :height=480>
                <fabric-circle 
                    id='c1'
                    :radius=radius
                    :alfa=alfa
                    :left=x1
                    :top=y1
                    :opacity= 0.50
                    :fill=fill
                    :stroke=stroke
                >
                </fabric-circle>

            </fabric-canvas>
        </div>
         -->

        <b-button type="submit" variant="primary" @click="enviar">Enviar</b-button>
        <div class="insideWrapper" style="float:left">
            <img :src=frameimage class="coveredImage" id="img_frame">     
            <canvas class="canvaframe" ref="can" width="300" height="480"></canvas>
        </div>

{{ circles }}
    </div>
</template>

<script>

import {apiFrame} from '../frame/api'
import { fabric } from 'fabric';

export default {

    name: "DetalhesFrame",

    components: {

    },
    data() {
        return {
            circles: [
                {top: 15, left: 17},
                {top: 15, left: 110},
                {top: 15, left: 199},

                {top: 100, left: 17},
                {top: 100, left: 110},
                {top: 100, left: 199},

                {top: 180, left: 17},
                {top: 180, left: 110},
                {top: 180, left: 199},

                {top: 260, left: 17},
                {top: 260, left: 110},
                {top: 260, left: 199},

                {top: 350, left: 17},
                {top: 350, left: 110},
                {top: 350, left: 199},

            ],
            fill: "#ffffff",
            stroke: "#000000",
            radius: 45,
            alfa: 0.5,
            frameimage: ''
        }
    },  
    methods: {   
        
        moved: function(e) {            
            console.log('s')
            console.log(e)
        },

        enviar: function()  {

            // canvas.forEachObject(function(o){ o.hasBorders = o.hasControls = false; });

            console.log(this.c1)
        },

        refresh() {
        }        
    },

    created() {        

        this.analiseCodigo = this.$route.params.analiseCodigo
        // this.refresh()

        apiFrame.getImage('5e11f60816478d0024580f95')
            .then((data) => {
                this.frameimage = data
            })
            .catch(e => {
                console.log(e)
            })
    },

    mounted() {
        const ref = this.$refs.can;
        const canvas = new fabric.Canvas(ref);

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
            canvas.add(c);
        }

        let that = this
        canvas.on('object:moved', function(options) {
            let id = parseInt(options.target.id)
            that.circles[id].top = parseInt(options.target.top)
            that.circles[id].left = parseInt(options.target.left)
        });

        canvas.renderAll();
    }
};
</script>

<style>
  body {
      background-color: ivory;
  }
  .outsideWrapper {
      width:100%;
      height:100%;
      margin:20px 60px;
      border:1px solid blue;
  }
  .insideWrapper {
      width:300px;
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
