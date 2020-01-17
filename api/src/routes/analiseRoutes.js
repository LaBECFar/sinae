const express = require('express');
const router = express.Router();
const analiseController = require('../controllers/analiseController')

// cadastro de analise - autenticação desnecessária para uso no app
router.post('/', analiseController.post); 

// listagem
router.get('/', auth, analiseController.list);

// detalhes
router.get('/:id', auth, analiseController.get);

// atualizar
router.put('/:id', auth, analiseController.put);

// remover
router.delete('/:id', auth, analiseController.delete);

// download de um arquivo .zip com todos os frames da analise
router.get('/:id/download-frames', auth, analiseController.downloadFrames);

// download de um arquivo .zip com todos os poços da analise
router.get('/:id/download-pocos', auth, analiseController.downloadPocos);

// download de um arquivo csv com as informações dos poços para serem usadas no cellprofiller
router.get('/:id/download-csv', auth, analiseController.exportCsv);

// processa os frames para extrair os poços do quadrante
router.post('/:id/extract-pocos', auth, analiseController.extractPocos);

module.exports = router;