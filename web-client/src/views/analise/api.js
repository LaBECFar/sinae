import { config } from "../../config";

export const apiAnalise = {
	novoAnalise(analise) {
		if (!analise) {
			return Promise.reject(new Error("Dados não informados."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/analise/`, analise)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao criar o analise ${e}`));
				});
		});
	},

	atualizarAnalise(analise) {
		if (!analise) {
			return Promise.reject(new Error("Dados não informados."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.put(`/analise/${analise._id}`, analise)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao atualizar o analise ${e}.`));
				});
		});
	},

	removerAnalise(analiseId) {
		if (!analiseId) {
			return Promise.reject(new Error("Dados não informados."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.delete(`/analise/${analiseId}`)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao remover o analise ${e}`));
				});
		});
	},

	listarAnalises(experimentoCodigo) {
		return new Promise((resolve, reject) => {
			config.api
				.get(`/analise/?experimentoCodigo=${experimentoCodigo}`)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(e);
				});
		});
	},

	getAnalise(analiseId) {
		return new Promise((resolve, reject) => {
			config.api
				.get(`/analise/${analiseId}`)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(e);
				});
		});
	},

	getApi() {
		return config.api;
	},

	getFramesDownloadLink(analiseId) {
		return `${config.URL_API}/analise/${analiseId}/download-frames`;
	},

	getPocosDownloadLink(analiseId) {
		return `${config.URL_API}/analise/${analiseId}/download-pocos`;
	},

	getCsvExportLink(analiseId) {
		return `${config.URL_API}/analise/${analiseId}/download-csv`;
	},

	getMotilityResultsLink(analiseId) {
		return `${config.URL_API}/analise/${analiseId}/download-motility-results`;
	},

	extractPocos(idAnalise, dados) {
		if (!dados || !idAnalise) {
			return Promise.reject(new Error("Dados não informados."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/analise/${idAnalise}/extract-pocos`, dados)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao criar o analise ${e}`));
				});
		});
	},

	extractFrames(form) {
		if (!form) {
			return Promise.reject(new Error("Dados não informados."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/analise/${form._id}/extract-frames`, form)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao atualizar o analise ${e}.`));
				});
		});
	},

	videoUrl(analiseId){
		return `${config.URL_API}/analise/${analiseId}/video`;
	},

	checkConfigFilesExist() {
		return new Promise((resolve, reject) => {
			config.api
				.get("/settings/check-config-files")
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(e);
				});
		});
	},

	startMotilityProcessor(idAnalise) {
		if (!idAnalise) {
			return Promise.reject(new Error("Analise não informada."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/analise/${idAnalise}/start-motility-processor`)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao iniciar a extração de parâmetros fenotípicos ${e}`));
				});
		});
	},

	resetMotility(idAnalise) {
		if (!idAnalise) {
			return Promise.reject(new Error("Analise não informada."));
		}
		return new Promise((resolve, reject) => {
			config.api
				.post(`/analise/${idAnalise}/reset-motility`)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(new Error(`Erro ao iniciar a extração de parâmetros fenotípicos ${e}`));
				});
		});
	},

	listAllWithVideo(experimentoCodigo) {
		return new Promise((resolve, reject) => {
			config.api
				.get(`/analise/all-with-video?experimentoCodigo=${experimentoCodigo}`)
				.then(resp => {
					resolve(resp.data);
				})
				.catch(e => {
					reject(e);
				});
		});
	},
};
