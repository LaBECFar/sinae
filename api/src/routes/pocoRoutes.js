const express = require('express');
const router = express.Router();
const auth = require('./auth')
const pocoController = require('../controllers/pocoController')


router.post('/extrair', auth, pocoController.extrair);


module.exports = router;