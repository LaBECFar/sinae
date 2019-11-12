const express = require('express');

const router = express.Router();

const experimentoController = require('../controllers/experimentoController')

router.get('/', experimentoController.list);

router.get('/:id', experimentoController.get);

router.post('/', experimentoController.post);

router.put('/:id', experimentoController.put);

router.delete('/:id', experimentoController.delete);

module.exports = router;