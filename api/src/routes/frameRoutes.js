const express = require('express');
const router = express.Router();
const auth = require('./auth')
const frameController = require('../controllers/frameController')


// listagem
router.get('/', auth, frameController.list);

// imagem em base64
router.get('/image/:id', auth, frameController.getImage);

// detalhes
router.get('/:id', auth, frameController.get);

// cadastrar - autenticação desnecessária para uso no app
router.post('/', frameController.post);

// atualizar
router.put('/:id', auth, frameController.put);

// remover
router.delete('/:id', auth, frameController.delete);


module.exports = router;