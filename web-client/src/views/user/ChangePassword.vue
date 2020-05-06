<template>
	<div class="container" v-if="!mailSent">
		<h1 class="text-center">Redefinir Senha</h1>

		<p class="text-center">
			Defina sua nova senha digitando-a nos campos abaixo.
		</p>

		<b-alert variant="danger" :show="msg.length > 0">{{ msg }}</b-alert>

		<b-form @submit="onSubmit">
			<b-form-group label="E-mail" label-for="email">
				<b-form-input id="email" v-model="form.email" type="text" />
			</b-form-group>

			<div class="actions">
				<b-button type="submit" variant="primary">
					Enviar e-mail de verificação
				</b-button>
			</div>
		</b-form>
	</div>
</template>

<script>
import { apiUsuario } from "./api"
//import { config } from "../../config"

export default {
	name: "forgotPassword",
	data() {
		return {
			msg: "",
			form: {
				email: "",
			},
			mailSent: false,
		}
	},
	methods: {
		onSubmit: function(event) {
			event.preventDefault()

			if (!this.form.email) {
				this.msg = "E-mail inválido"
				return
			}

			apiUsuario
				.forgotPassword(this.form.email)
				.then((data) => {
					if (data.success) {
						this.mailSent = true
					}
				})
				.catch((e) => {
					this.msg = e.message
				})
		},
	},
}
</script>

<style scoped>
h1 {
	font-size: 30px;
	font-weight: 900;
	text-transform: uppercase;
}
.container {
	max-width: 500px;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	min-height: 100vh;
}
p {
	font-size: 14px;
}
.actions {
	text-align: center;
}
#menu {
	display: none;
}
</style>
