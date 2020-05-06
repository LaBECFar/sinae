<template>
	<div class="login-container">
		<h1 class="text-center">Login</h1>
		<b-alert variant="danger" :show="msg.length > 0">{{ msg }}</b-alert>

		<b-form @submit="onSubmit">
			<b-form-group id="input-group-1" label="E-mail" label-for="email">
				<b-form-input id="email" v-model="form.email" type="text" />
			</b-form-group>

			<b-form-group
				id="input-group-2"
				label="Password"
				label-for="password"
			>
				<b-form-input
					id="password"
					v-model="form.password"
					type="password"
				/>
			</b-form-group>

			<div class="actions">
				<b-button type="submit" variant="primary">Fazer Login</b-button>
				<b-button type="button" variant="link" v-on:click="resetPassword">
					Esqueceu a senha?
				</b-button>
			</div>
		</b-form>
	</div>
</template>

<script>
import { apiUsuario } from "./api"
import { config } from "../../config"

export default {
	name: "login",
	data() {
		return {
			msg: "",
			form: {
				email: "",
				password: "",
			},
		}
	},
	methods: {
		onSubmit: function(event) {
			event.preventDefault()

			if (!this.form.email) {
				this.msg = "E-mail inválido"
				return
			}

			if (!this.form.password) {
				this.msg = "Senha inválida"
				return
			}

			apiUsuario
				.login(this.form.email, this.form.password)
				.then((data) => {
					if (data.success) {
						// this.$router.push("/experimento");
						window.location = config.URL_APP
					}
				})
				.catch((e) => {
					this.msg = e.message
				})
        },
        
        resetPassword(){
            this.$router.push("/forgot-password")
        }
	},
	created() {
		//this.refresh();
	},
}
</script>

<style scoped>
h1 {
	font-size: 30px;
	font-weight: 900;
	text-transform: uppercase;
}
.login-container {
	max-width: 500px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 100vh;
}
.actions {
	text-align: center;
	display: flex;
	justify-content: space-between;
}
#menu {
	display: none;
}
</style>
