const express = require('express');

const router = express.Router();

const pocoController = require('../controllers/pocoController')

router.post('/extrair', pocoController.extrair);

/*
router.get('/', frameController.list);

router.get('/:id', frameController.get);

router.post('/', frameController.post);

router.put('/:id', frameController.put);

router.delete('/:id', frameController.delete);
*/
module.exports = router;