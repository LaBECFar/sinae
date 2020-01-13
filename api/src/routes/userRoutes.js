const express = require('express');
const middleware = require('./middleware');
const router = express.Router();

const userController = require('../controllers/userController')

router.post('/login', userController.login);

module.exports = router;