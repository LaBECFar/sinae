const express = require('express');

const router = express.Router();

const analiseController = require('../controllers/analiseController')

router.get('/', analiseController.list);

router.get('/:id', analiseController.get);

router.get('/:id/download-frames', analiseController.downloadFrames);

router.get('/:id/download-pocos', analiseController.downloadPocos);

router.get('/:id/download-csv', analiseController.exportCsv);

router.post('/', analiseController.post);

router.post('/:id/extract-pocos', analiseController.extractPocos);

router.put('/:id', analiseController.put);

router.delete('/:id', analiseController.delete);

module.exports = router;