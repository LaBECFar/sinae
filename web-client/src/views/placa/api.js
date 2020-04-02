import { config } from "../../config";

export const apiPlaca = {
    novo(item) {
        if (!item) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .post(`/placa/`, item)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao criar a placa ${e}`));
                });
        });
    },

    atualizarPlaca(placa) {
        if (!placa) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .put(`/placa/${placa._id}`, placa)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao atualizar a placa ${e}.`));
                });
        });
    },

    removerPlaca(id) {
        if (!id) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .delete(`/placa/${id}`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao remover a placa ${e}`));
                });
        });
    },

    listarPlacas() {
		return new Promise((resolve, reject) => {
            config.api
                .get(`/placa/`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    },

    getPlaca(id) {
        return new Promise((resolve, reject) => {
            config.api
                .get(`/placa/${id}`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    },

    getCsvMetadadosLink(id) {
		return `${config.URL_API}/placa/${id}/export-metadados`;
	}
};
