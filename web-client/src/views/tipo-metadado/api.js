import { config } from "../../config";

export const apiTipoMetadado = {
    novoTipoMetadado(tipo) {
        if (!tipo) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .post(`/tipo-metadado/`, tipo)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao criar o tipo de metadado ${e}`));
                });
        });
    },

    atualizarTipoMetadado(tipo) {
        if (!tipo) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .put(`/tipo-metadado/${tipo._id}`, tipo)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao atualizar o tipo de metadado ${e}.`));
                });
        });
    },

    removerTipoMetadado(id) {
        if (!id) {
            return Promise.reject(new Error("Dados não informados."));
        }
        return new Promise((resolve, reject) => {
            config.api
                .delete(`/tipo-metadado/${id}`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(new Error(`Erro ao remover o tipo de metadado ${e}`));
                });
        });
    },

    listarTiposMetadado() {
		return new Promise((resolve, reject) => {
            config.api
                .get(`/tipo-metadado/`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    },

    getTipoMetadado(id) {
        return new Promise((resolve, reject) => {
            config.api
                .get(`/tipo-metadado/${id}`)
                .then(resp => {
                    resolve(resp.data);
                })
                .catch(e => {
                    reject(e);
                });
        });
    }
};
