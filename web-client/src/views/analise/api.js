import { config } from '../../config'

export const apiAnalise = {

  novoAnalise (analise) {
    if (!analise) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.post(`/analise/`,analise)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao criar o analise ${e}`))
        })
    })
  },

  atualizAranalise (analise) {
    if (!analise) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.put(`/analise/${analise._id}`,analise)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao atualizar o analise ${e}.`))
        })
    })
  },

  removerAnalise (analiseId) {
    if (!analiseId) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.delete(`/analise/${analiseId}`)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao remover o analise ${e}`))
        })
    })
  },  

  listarAnalises (experimentoCodigo) {
    console.log(experimentoCodigo)
    return new Promise((resolve, reject) => {
      config.api.get(`/analise/?experimentoCodigo=${experimentoCodigo}`)
        .then(resp => {
            resolve(resp.data)
        })
        .catch(e => {
            reject(e)
        })
    })
  },

  getAnalise (analiseId) {
    return new Promise((resolve, reject) => {
      config.api.get(`/analise/${analiseId}`)
        .then(resp => {
          resolve(resp.data)
        })
        .catch(e => {
          reject(e)
        })
    })
  },

  getFramesDownloadLink(analiseId){
    return `${config.URL_API}/analise/${analiseId}/download-frames`
  },

  getPocosDownloadLink(analiseId){
    return `${config.URL_API}/analise/${analiseId}/download-pocos`
  },

  getCsvExportLink(analiseId){
    return `${config.URL_API}/analise/${analiseId}/download-csv`
  },

  extractPocos (idAnalise, dados) {
    if (!dados || !idAnalise) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.post(`/analise/${idAnalise}/extract-pocos`,dados)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao criar o analise ${e}`))
        })
    })
  },  
}