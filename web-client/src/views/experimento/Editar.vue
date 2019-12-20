<template>
    <div>
        <h2>Novo Experimento</h2>

        <b-alert :show="msg.text" :v-show="msg.text" :variant=msg.type>
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
                    <b-button type="submit" variant="primary">Save</b-button>
                </b-col>
                <b-col class="text-right">
                    <b-button to="/experimento" variant="secondary">Back</b-button>        
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
                id: '',
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
            apiDevice.updateDevice(this.form)
                .then(() => {
                    this.msg.text = "Device saved"
                    this.msg.type = "success"
                })
                .catch((e) => {
                    this.msg.text = `Error when saving device ${e}`
                    this.msg.type = "danger"
                })
        },
        refresh() {
            apiDevice.getConnectionTypes()
                .then((ret) => {
                    this.connectionTypes = ret
                })
        }
    },
    created() {
        this.refresh()
    }
}
</script>