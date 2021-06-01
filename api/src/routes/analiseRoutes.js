const express = require('express');
const router = express.Router();
const auth = require('./auth')
const analiseController = require('../controllers/analiseController')

// analysis creation - authentication not necessary on app
router.post('/', analiseController.post); 

// lists
router.get('/', auth, analiseController.list);

// lists only analysis with video
router.get('/all-with-video', auth, analiseController.listAllWithVideo);

// datails
router.get('/:id', auth, analiseController.get);

// update
router.put('/:id', auth, analiseController.put);

// remove
router.delete('/:id', auth, analiseController.delete);

// download a zip with all video frames from a specific analysis
router.get('/:id/download-frames', analiseController.downloadFrames);

// download a zip with all wells from a specific analysis
router.get('/:id/download-pocos', analiseController.downloadPocos);

// streams analysis video
router.get('/:id/video', analiseController.videoStream);

// download to a csv file with wells information
router.get('/:id/download-csv', analiseController.exportCsv);

// download zip with results of motility processor files
router.get('/:id/download-motility-results', analiseController.downloadMotilityResults);

// process the video frames to extract the wells
router.post('/:id/extract-pocos', auth, analiseController.extractPocos);

// saves video on server
router.post('/:id/upload-video', auth, analiseController.uploadVideo);

// extract video frames
router.post('/:id/extract-frames', auth, analiseController.extractFrames);

// starts the container cellprofiler_processor that processes well images to get the parasites motility
router.post('/:id/start-motility-processor', auth, analiseController.startMotilityProcessor);

router.post('/:id/reset-motility', auth, analiseController.resetMotility);


module.exports = router;