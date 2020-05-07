<template>
	<div>
		<div class="container" v-if="!registered">
			<h1>Registrar-se</h1>
			<p>Preencha os campos abaixo para criar uma conta de acesso.</p>

			<b-alert variant="danger" :show="msg.length > 0">{{ msg }}</b-alert>

			<b-form @submit="onSubmit">
				<b-form-group label="Nome" label-for="name">
					<b-form-input
						id="name"
						v-model="form.name"
						type="name"
						required
					/>
				</b-form-group>

				<b-form-group
					label="E-mail"
					label-for="email"
					description="Use um e-mail que você tenha acesso, para recuperar sua conta caso necessário"
				>
					<b-form-input
						id="email"
						v-model="form.email"
						type="email"
						required
					/>
				</b-form-group>

				<b-form-group label="Senha" label-for="password">
					<b-form-input
						id="password"
						v-model="form.password"
						type="password"
						required
					/>
				</b-form-group>

				<b-form-group
					label="Repita a senha"
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
						Confirmar registro
					</b-button>

					<b-spinner
						variant="primary"
						label="Spinning"
						v-show="loading"
					></b-spinner>
				</div>
			</b-form>
		</div>

		<div class="container" v-if="registered">
			<h1>Registrado com sucesso!</h1>
			<p>
				Agora você pode começar a registrar seus experimentos, acesse
				sua conta fazendo login.
			</p>
			<div class="actions">
				<b-button
					type="button"
					variant="primary"
					v-on:click="loginPage()"
				>
					Página de Login
				</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import { apiUsuario } from "./api"

export default {
	name: "register",
	data() {
		return {
			msg: "",
			form: {
				password: "",
				confirmPassword: "",
				email: "",
				name: "",
			},
			loading: false,
			registered: false,
		}
	},

	methods: {
		onSubmit: function(event) {
			event.preventDefault()

			if (!this.form.name) {
				this.msg = "Nome inválido"
				return
			}

			if (!this.form.password) {
				this.msg = "Senha inválida"
				return
			}

			if (!this.form.email) {
				this.msg = "E-mail inválido"
				return
			}

			if (this.form.password != this.form.confirmPassword) {
				this.msg = "A senha deve ser a mesma nos dois campos"
				return
			}

			apiUsuario
				.register(this.form)
				.then((data) => {
					if (data.success) {
						this.registered = true
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
