<template>
    <div>
        <h2>Editar Experimento</h2>

        <b-alert show v-show="msg.text" :variant="msg.type">
            {{ msg.text }}
        </b-alert>

        <b-form @submit="onSubmit">
            <b-form-group id="input-group-1" label="Código:" label-for="codigo">
                <b-form-input id="codigo" v-model="form.codigo" type="text" required/>
            </b-form-group>

            <b-form-group id="input-group-1" label="Label:" label-for="label">
                <b-form-input id="label" v-model="form.label" type="text" required/>
            </b-form-group>
            <b-row>
                <b-col>
                    <b-button type="submit" variant="primary">Salvar</b-button>
                </b-col>
                <b-col class="text-right">
                    <b-button to="/experimento" variant="secondary">Voltar</b-button>        
                </b-col>
            </b-row>
        </b-form>

  </div>
</template>

<script>
import {apiExperimento} from './api'

export default {
    name: 'editarExperimento',
    data() {
        return {
            form: {
                _id: '',
                codigo: '',
                label: ''                
            },
            msg: {
                text: false,
                type: ''
            }
        }
    },

    methods: {
        onSubmit(evt) {
            evt.preventDefault()
            apiExperimento.atualizarExperimento(this.form)
                .then(() => {
                    this.msg.text = "Experimendo atualizado"
                    this.msg.type = "success"
                })
                .catch((e) => {
                    this.msg.text = `Erro ao atualizar o experimento ${e}`
                    this.msg.type = "danger"
                })
        },
        refresh() {
            apiExperimento.getExperimento(this.$route.params.id)
                .then((ret) => {
                    this.form = ret
                })
        }
    },
    created() {
        this.refresh()
    }
}
</script>