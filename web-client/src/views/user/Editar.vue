<template>
    <div>
        <h2>Editar Usuário</h2>

        <b-alert :show="msg.text" :v-show="msg.text" :variant=msg.type>
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
                <b-form-input id="password" v-model="form.password" type="password" autocomplete="nope" aria-autocomplete="nope"/>
            </b-form-group>

            <b-form-group v-if="isAdmin">
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
import { apiUsuario } from './api'

export default {
    name: 'userEditar',
    data() {
        return {
            form: {
                _id: '',
                name: '',
                email: '',
                password: '',
                isAdmin: false           
            },
            msg: {
                text: false,
                type: ''
            },
            isAdmin: false
        }
    },

    methods: {
        onSubmit(evt) {
            evt.preventDefault()

            apiUsuario.atualizarUsuario(this.form)
                .then((user) => {
                    this.msg.text = "Usuário atualizado"
                    this.msg.type = "success"

                    if(user._id == localStorage.getItem('userid')){
                        apiUsuario.logout();
                        this.$router.push("/#/login");
                    }
                })
                .catch((e) => {
                    this.msg.text = `Erro ao atualizar o usuário ${e}`
                    this.msg.type = "danger"
                })
        },
        refresh() {
            apiUsuario.getUsuario(this.$route.params.id)
                .then((ret) => {
                    this.form = ret
                })
        }
    },
    created() {
        this.isAdmin = localStorage.getItem('isAdmin')
        this.refresh()
    }
}
</script>