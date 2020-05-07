<template>
	<div>
		<div class="container" v-if="!mailSent">
			<h1>Esqueci a Senha</h1>

			<p>
				Preencha seu e-mail abaixo. Enviaremos um email que permitirá
				que você redefina a sua senha.
			</p>

			<b-alert variant="danger" :show="msg.length > 0">{{ msg }}</b-alert>

			<b-form @submit="onSubmit">
				<b-form-group label="E-mail" label-for="email">
					<b-form-input id="email" v-model="form.email" type="email" required />
				</b-form-group>

				<div class="actions">
					<b-button
						type="submit"
						variant="primary"
						:disabled="sending"
					>
						Enviar e-mail de verificação
					</b-button>

					<b-spinner
						variant="primary"
						label="Spinning"
						v-show="sending"
					></b-spinner>
				</div>
			</b-form>
		</div>

		<div class="container" v-if="mailSent">
			<h1>Seu e-mail de redefinição de senha foi enviado!</h1>
			<p>
				Enviamos um e-mail de redefinição de senha para o seu e-mail <strong>{{ form.email }}</strong>.
			</p>
			<p>Verifique sua caixa de entrada para continuar.</p>
		</div>
	</div>
</template>

<script>
import { apiUsuario } from "./api"

export default {
	name: "forgotPassword",
	data() {
		return {
			msg: "",
			form: {
				email: "",
			},
			mailSent: false,
			sending: false,
		}
	},
	methods: {
		onSubmit: function(event) {
			event.preventDefault()

			if (!this.form.email) {
				this.msg = "E-mail inválido"
				return
			}

			this.sending = true

			apiUsuario
				.forgotPassword(this.form.email)
				.then((data) => {
					if (data.success) {
						this.mailSent = true
					}
					this.sending = false
				})
				.catch((e) => {
					this.msg = e.message
					this.sending = false
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
	font-size: 16px;
}
.actions {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
#menu {
	display: none;
}
</style>
