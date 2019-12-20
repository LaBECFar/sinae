import { config } from '../../config'

export const apiExperimento = {

  novoExperimento (experimento) {
    if (!experimento) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.post(`/experimento/`,experimento)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao criar o experimento ${e}`))
        })
    })
  },

  atualizarExperimento (experimento) {
    if (!experimento) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.put(`/experimento/${experimento.id}`,experimento)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao atualizar o Experimento ${e}.`))
        })
    })
  },

  removerExperimento (experimentoId) {
    if (!experimentoId) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.delete(`/experimento/${experimentoId}`)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao remover o Experimento ${e}`))
        })
    })
  },  

  lisatrExperimentos () {
    return new Promise((resolve, reject) => {
      config.api.get(`/experimento/`)
        .then(resp => {
            resolve(resp.data)
        })
        .catch(e => {
            reject(e)
        })
    })
  },

  getExperimento (experimentoId) {
    return new Promise((resolve, reject) => {
      config.api.get(`/experimento/${experimentoId}`)
        .then(resp => {
          resolve(resp.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  }
}