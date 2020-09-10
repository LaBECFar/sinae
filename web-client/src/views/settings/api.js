import { config } from "../../config"

export const apiSettings = {
	update(settings) {
		if (!settings) {
			return Promise.reject(new Error("Dados não informados."))
		}
		return new Promise((resolve, reject) => {
			config.api
				.put(`/settings/`, settings)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(
						new Error(`Erro ao atualizar as configurações ${e}.`)
					)
				})
		})
	},

	get() {
		return new Promise((resolve, reject) => {
			config.api
				.get(`/settings/`)
				.then((resp) => {
					resolve(resp.data)
				})
				.catch((e) => {
					reject(e)
				})
		})
	},
}
