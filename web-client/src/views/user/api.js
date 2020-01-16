import {
	config
} from '../../config'

export const apiUsuario = {

	login(email, password) {
		if (!email || !password) {
			return Promise.reject(new Error('Dados não informados.'))
		}
		return new Promise((resolve, reject) => {
			config.api.post('/user/login', {
					email,
					password
				})
				.then(resp => {
					let { token, success, isAdmin } = resp.data

					if (success) {
						if(token) localStorage.setItem('token', token)
						if(isAdmin) localStorage.setItem('isAdmin', isAdmin)
					}

					resolve(resp.data)
				})
				.catch((e) => {
					reject(new Error(`Erro ao fazer login ${e}`))
				})
		})
	}

}