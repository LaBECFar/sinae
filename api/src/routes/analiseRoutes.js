const express = require('express');
const router = express.Router();
const auth = require('./auth')
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
router.get('/:id/download-frames', analiseController.downloadFrames);

// download de um arquivo .zip com todos os poços da analise
router.get('/:id/download-pocos', analiseController.downloadPocos);

// stream do vídeo da análise caso exista
router.get('/:id/video', analiseController.videoStream);

// download de um arquivo csv com as informações dos poços para serem usadas no cellprofiller
router.get('/:id/download-csv', analiseController.exportCsv);

// processa os frames para extrair os poços do quadrante
router.post('/:id/extract-pocos', auth, analiseController.extractPocos);

// salva o vídeo no servidor
router.post('/:id/upload-video', auth, analiseController.uploadVideo);

// extrair frames do vídeo
router.post('/:id/extract-frames', auth, analiseController.extractFrames);

module.exports = router;