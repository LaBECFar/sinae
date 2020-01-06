const express = require('express');

const router = express.Router();

const frameController = require('../controllers/frameController')

router.get('/', frameController.list);

router.get('/image/:id', frameController.getImage);

router.get('/:id', frameController.get);

router.post('/', frameController.post);

router.put('/:id', frameController.put);

router.delete('/:id', frameController.delete);

module.exports = router;