const express = require('express');
const auth = require('./auth');

const router = express.Router();
const experimentoController = require('../controllers/experimentoController')

router.get('/', auth, experimentoController.list);

router.get('/:id', experimentoController.get);

router.get('/codigo/:codigo', experimentoController.getByCodigo);

router.post('/', experimentoController.post);

router.put('/:id', experimentoController.put);

router.delete('/:id', experimentoController.delete);

module.exports = router;