const express = require('express')
const auth = require('./auth')
const router = express.Router()
const experimentoController = require('../controllers/experimentoController')


// detalhes por id
router.get('/:id', experimentoController.get)

// detalhes por codigo
router.get('/codigo/:codigo', experimentoController.getByCodigo) 

// criar novo experimento
router.post('/', experimentoController.post) 

// listagem de experimentos criados pelo usuário
router.get('/', auth, experimentoController.list)

// atualizar
router.put('/:id', auth, experimentoController.put)

// deletar experimento
router.delete('/:id', auth, experimentoController.delete)


module.exports = router;