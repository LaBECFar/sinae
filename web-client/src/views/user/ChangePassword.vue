<template>
	<div>
		<div class="container" v-if="!changed">
			<h1>Redefinir Senha</h1>
			<p>Defina sua nova senha digitando-a nos campos abaixo.</p>

			<b-alert variant="danger" :show="msg.length > 0">{{ msg }}</b-alert>

			<b-form @submit="onSubmit">
				<b-form-group label="Nova Senha" label-for="password">
					<b-form-input
						id="password"
						v-model="form.password"
						type="password"
						required
					/>
				</b-form-group>

				<b-form-group
					label="Repita a nova senha"
					label-for="confirm-password"
				>
					<b-form-input
						id="confirm-password"
						v-model="form.confirmPassword"
						type="password"
						required
					/>
				</b-form-group>

				<div class="actions">
					<b-button
						type="submit"
						variant="primary"
						:disabled="loading"
					>
						Alterar senha
					</b-button>

					<b-spinner
						variant="primary"
						label="Spinning"
						v-show="loading"
					></b-spinner>
				</div>
			</b-form>
		</div>

		<div class="container" v-if="changed">
			<h1>Senha alterada!</h1>
			<p>
				Sua senha foi alterada com sucesso, agora você pode fazer login
				usando sua nova senha.
			</p>
			<div class="actions">
				<b-button type="button" variant="primary" v-on:click="loginPage()">
					Página de Login
				</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import { apiUsuario } from "./api"

export default {
	name: "changePassword",
	data() {
		return {
			msg: "",
			form: {
				password: "",
				confirmPassword: "",
				token: "",
				userid: "",
			},
			loading: false,
			changed: false,
		}
	},
	created() {
		this.form.userid = this.$route.params.userid
		this.form.token = this.$route.params.token
	},
	methods: {
		onSubmit: function(event) {
			event.preventDefault()

			if (!this.form.password) {
				this.msg = "Senha inválida"
				return
			}

			if (this.form.password != this.form.confirmPassword) {
				this.msg = "A senha deve ser a mesma nos dois campos"
				return
			}

			if (!this.form.token || !this.form.userid) {
				this.msg = "URL inválida, tente solicitar um novo e-mail de recuperação"
				console.log(this.form.token)
				return
			}

			const { userid, token, password } = this.form

			apiUsuario
				.changePassword(userid, token, password)
				.then((data) => {
					if (data.success) {
						this.changed = true
					}
					this.loading = false
				})
				.catch((e) => {
					this.msg = e.message
					this.loading = false
				})
		},

		loginPage() {
			this.$router.push("/login")
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
