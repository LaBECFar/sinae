const express = require('express');

const router = express.Router();

const analiseController = require('../controllers/analiseController')

router.get('/', analiseController.list);

router.get('/:id', analiseController.get);

router.get('/:id/download-frames', analiseController.downloadFrames);

router.post('/', analiseController.post);

router.put('/:id', analiseController.put);

router.delete('/:id', analiseController.delete);

module.exports = router;