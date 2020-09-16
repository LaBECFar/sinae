<template>
    <div>
        <h2>Editar Análise</h2>

        <b-alert show v-show="msg.text" :variant="msg.type">
            {{ msg.text }}
        </b-alert>

        <b-form @submit="onSubmit">
            <p>
            <strong>Experimento:</strong> {{form.experimentoCodigo}}
            </p>

            <b-form-group id="input-group-1" label="Tempo do Experimento:" label-for="label">
                <b-form-input id="label" v-model="form.tempo" type="text" required/>
            </b-form-group>

            <b-form-group id="input-group-1" label="Placa:" label-for="placa">
                <b-form-input id="placa" v-model="form.placa" type="text" required/>
            </b-form-group>

            <b-form-group id="input-group-1" label="Data Coleta:" label-for="label">
                <b-form-input 
                    id="label" 
                    v-model="form.dataColeta"                     
                    type="text" 
                    required/>
            </b-form-group>

            <b-row>
                <b-col>
                    <b-button type="submit" variant="primary">Salvar</b-button>
                </b-col>
                <b-col class="text-right">
                    <b-button @click="back()" variant="secondary">Voltar</b-button>        
                </b-col>
            </b-row>
        </b-form>
  </div>
</template>

<script>
import {apiAnalise} from './api'
import moment from 'moment'

export default {
    name: 'editarAnalise',
    data() {
        return {
            form: {
                _id: '',
                experimentoCodigo: '',
                tempo: '',
                dataColeta: '',
                placa: ''
            },
            msg: {
                text: false,
                type: ''
            }
        }
    },

    methods: {
        back() {
            this.$router.push(`/experimento/${this.form.experimentoCodigo}/analises/`)
        },
        
        onSubmit(evt) {
            evt.preventDefault()
            apiAnalise.atualizarAnalise(this.form)
                .then(() => {
                    this.msg.text = "Análise atualizada"
                    this.msg.type = "success"
                })
                .catch((e) => {
                    this.msg.text = `Erro ao atualizar a análise ${e}`
                    this.msg.type = "danger"
                })
        },
        refresh() {
            apiAnalise.getAnalise(this.$route.params.id)
                .then((ret) => {
                    ret.dataColeta = moment.utc(ret.dataColeta).format("DD/MM/YYYY")
                    this.form = ret
                })
        }
    },
    created() {
        this.refresh()
    }
}
</script>