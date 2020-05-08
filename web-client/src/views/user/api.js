import { config } from "../../config"

export const apiUsuario = {
	login(email, password) {
		if (!email || !password) {
			return Promise.reject(new Error("Dados não informados."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.post("/user/login", {
					email,
					password,
				})
				.then((resp) => {
					let { token, success, isAdmin, userid } = resp.data

					if (success) {
						if (token) localStorage.setItem("token", token)
						if (isAdmin) localStorage.setItem("isAdmin", isAdmin)
						if (userid) localStorage.setItem("userid", userid)
					}

					resolve(resp.data)
				})
				.catch((e) => {
					let errorMsg =
						"Não foi possível fazer login, verifique sua conexão e tente novamente"

					if (e.response && e.response.data) {
						const { error, message } = e.response.data

						if (error) {
							errorMsg = message
						}
					}

					reject(new Error(errorMsg))
				})
		})
	},

	criarUsuario(user) {
		if (!user) {
			return Promise.reject(new Error("Dados não informados."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/user/`, user)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(new Error(`Erro ao criar o usuário ${e}`))
				})
		})
	},

	logout() {
		localStorage.removeItem("token")
		localStorage.removeItem("isAdmin")
	},

	removerUsuario(userId) {
		if (!userId) {
			return Promise.reject(new Error("Dados não informados."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.delete(`/user/${userId}`)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(new Error(`Erro ao remover o usuário ${e}`))
				})
		})
	},

	listarUsuarios() {
		return new Promise((resolve, reject) => {
			config.api
				.get(`/user/`)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(e)
				})
		})
	},

	getUsuario(userId) {
		return new Promise((resolve, reject) => {
			config.api
				.get(`/user/${userId}`)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(e)
				})
		})
	},

	atualizarUsuario(user) {
		if (!user) {
			return Promise.reject(new Error("Dados não informados."))
		}

		if (!user.password) {
			delete user.password
		}

		return new Promise((resolve, reject) => {
			config.api
				.put(`/user/${user._id}`, user)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(new Error(`Erro ao atualizar o Usuário ${e}.`))
				})
		})
	},

	forgotPassword(email) {
		if (!email) {
			return Promise.reject(new Error("E-mail não informado."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/user/forgot-password`, { email })
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					let msg =
						"Não foi possível solicitar a redefinição de senha"

					if (
						e.response &&
						e.response.data &&
						e.response.data.message
					) {
						msg = e.response.data.message
					}

					reject(new Error(msg))
				})
		})
	},

	changePassword(userid, token, password) {
		if (!userid || !token) {
			return Promise.reject(new Error("URL inválida."))
		}
		if (!password) {
			return Promise.reject(new Error("Senha não informada."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/user/change-password`, { userid, token, password })
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					let msg = "Erro ao alterar a senha"

					if (
						e.response &&
						e.response.data &&
						e.response.data.message
					) {
						msg = e.response.data.message
					}

					reject(new Error(msg))
				})
		})
	},

	register(user) {
		if (!user) {
			return Promise.reject(new Error("Dados não informados."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/user/register`, user)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					let msg =
						"Erro ao cadastrar-se, verifique se os campos estão digitados corretamente"
					if (
						e.response &&
						e.response.data &&
						e.response.data.errors &&
						e.response.data.errors.length > 0
					) {
						msg = e.response.data.errors[0].msg
					}
					reject(new Error(msg))
				})
		})
	},
}
