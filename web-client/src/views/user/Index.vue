<template>
  <div>    
    <loading :active.sync="isLoading" :is-full-page="true"></loading>   
       
    <b-row>
        <b-col>            
            <h2>
                <v-icon style="width: 32px;" name="users"></v-icon>
                Usuários
            </h2>
        </b-col>
        <b-col class="text-right">
            <b-button to="/user/novo" variant="success" class="mr-2">
                <v-icon name="plus"></v-icon>Novo
            </b-button>    
        </b-col>
    </b-row>

    <b-row>
        <b-col>            
            <b-alert :show="msg.text" :v-show="msg.text" :variant=msg.type>
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


      <template v-slot:cell(actions)="row">    

        <b-button variant="primary" size="sm" @click="editarUsuario(row.item)" class="mr-2">
            <v-icon name="edit-2"></v-icon>
        </b-button>

        <b-button variant="danger" size="sm" @click="removerUsuario(row.item)" class="mr-2">
            <v-icon name="trash"></v-icon>            
        </b-button>
      </template>        

        <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
        </div>      
    </b-table>

    <b-alert 
        variant="secondary" 
        class="text-center" 
        :show="items.length <= 0">
        Ainda não existem usuários cadastrados
    </b-alert>

    <b-row>
        <b-col class="text-right">
            <strong>Total: {{ items.length }}</strong>
        </b-col>
    </b-row>

  </div>
</template>

<script>
import {apiUsuario} from './api'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: 'UserIndex',
    components: { Loading },
    data() {
        return {
            isBusy: true,
            isLoading: false,
            fields: [{
                key:'name',
                label: 'Nome'
            }, {
                key: 'email',
                label: 'E-mail'
            }, {
                key:'actions',
                label: 'Ações',
                class: 'userIndexActions'
            }],
            items: [],
            msg: {
                text: false,
                type: ''
            }
        }
    },
    methods: {
        editarUsuario (user) {
            this.$router.push(`/user/${user._id}/editar`)
        },

        removerUsuario(user) {
            this.$swal.fire({
                title: 'Tem certeza?',
                text: "Você não poderá desfazer isso ok!",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, REMOVER o usuário!'
            }).then((result) => {
                if (result.value) {
                    apiUsuario.removerUsuario(user._id)
                        .then(() => {
                            this.refresh()
                        })
                }
            })
        },

        refresh() {
            this.isBusy = true
            this.isLoading = false
            apiUsuario.listarUsuarios()
                .then((data) => {
                    this.items = data
                    this.isBusy = false
                })
                .catch(() => {
                    this.isBusy = false
                })
        }
    },
    created() {
        this.refresh()
    }
}
</script>

<style>
    .userIndexActions {
        width: 150px;
        text-align: center;
    }
</style>