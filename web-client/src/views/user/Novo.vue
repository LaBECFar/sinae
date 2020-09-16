<template>
    <div>
        <h2>Novo Usuário</h2>

        <b-alert show v-show="msg.text" :variant="msg.type">
            {{ msg.text }}
        </b-alert>

        <b-form @submit="onSubmit">
            <b-form-group label="Nome:" label-for="name">
                <b-form-input id="name" v-model="form.name" type="text" required/>
            </b-form-group>

            <b-form-group label="E-mail:" label-for="email">
                <b-form-input id="email" v-model="form.email" type="email" required/>
            </b-form-group>

            <b-form-group label="Senha:" label-for="password">
                <b-form-input id="password" v-model="form.password" type="password" required/>
            </b-form-group>

            <b-form-group>
                <b-form-checkbox v-model="form.isAdmin"
                    name="isAdmin"
                    value="true"
                    unchecked-value="false">Admin</b-form-checkbox>
            </b-form-group>

            <hr>
            
            <b-row>
                <b-col>
                    <b-button type="submit" variant="primary">Salvar</b-button>
                </b-col>
                <b-col class="text-right">
                    <b-button to="/user" variant="secondary">Voltar</b-button>        
                </b-col>
            </b-row>
        </b-form>
  </div>
</template>

<script>
import {apiUsuario} from './api'

export default {
    name: 'novoExperimento',
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
                isAdmin: false
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
            apiUsuario.criarUsuario(this.form)
                .then(() => {
                    this.msg.text = "Usuário criado"
                    this.msg.type = "success"
                })
                .catch((e) => {
                    this.msg.text = `Erro ao criar o usuário ${e}`
                    this.msg.type = "danger"
                })
        }
    },
    created() {
    }
}
</script>