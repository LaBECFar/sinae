import { config } from "../../config";

export const apiMetadado = {
    novoMetadado(metadado) {
        if (!metadado) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .post(`/metadado/`, metadado)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao criar o metadado ${e}`));
                });
        });
    },

    atualizarMetadado(metadado) {
        if (!metadado) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .put(`/metadado/${metadado._id}`, metadado)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao atualizar o metadado ${e}.`));
                });
        });
    },

    removerMetadado(metadadoId) {
        if (!metadadoId) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .delete(`/metadado/${metadadoId}`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao remover o metadado ${e}`));
                });
        });
    },

    listarMetadados() {
		return new Promise((resolve, reject) => {
            config.api
                .get(`/metadado/`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    },

    getMetadado(metadadoId) {
        return new Promise((resolve, reject) => {
            config.api
                .get(`/metadado/${metadadoId}`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
};
