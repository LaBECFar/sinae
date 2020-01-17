const express = require('express')
const auth = require('./auth')
const router = express.Router()
const experimentoController = require('../controllers/experimentoController')


// detalhes por id
router.get('/:id', auth, experimentoController.get)

// detalhes por codigo - autenticação desnecessária para uso no app
router.get('/codigo/:codigo', experimentoController.getByCodigo) 

// cadastro de experimento
router.post('/', auth,  experimentoController.post) 

// listagem de experimentos criados pelo usuário
router.get('/', auth, experimentoController.list)

// atualizar
router.put('/:id', auth, experimentoController.put)

// remover
router.delete('/:id', auth, experimentoController.delete)


module.exports = router;