import { config } from '../../config'

export const apiFrame = {

  getImage (id) {
    if (!id) {
      return Promise.reject(new Error('Dados não informados.'))
    }
    return new Promise((resolve, reject) => {
      config.api.get(`/frame/image/${id}`)
        .then(resp => {
          resolve(resp.data)
        })
        .catch((e) => {
          reject(new Error(`Erro ao recuperar a imagem ${e}`))
        })
    })
  }
}