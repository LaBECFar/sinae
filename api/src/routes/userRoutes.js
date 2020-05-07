const express = require('express');
const auth = require('./auth');
const router = express.Router();
const userController = require('../controllers/userController')

// login usando json web token (jwt)
router.post('/login', userController.login);

// solicitar e-mail para redefinicao de senha
router.post('/forgot-password', userController.forgotPassword);

// solicitar e-mail para redefinicao de senha
router.post('/change-password', userController.changePassword);

// listagem
router.get('/', auth, userController.list);

// detalhes usuario que fez login
router.get('/info', auth, userController.tokenUserInfo);

// detalhes
router.get('/:id', auth, userController.get);

// detalhes usando e-mail
router.get('/email/:email', auth, userController.getByEmail);

// cadastro
router.post('/', auth, userController.post);

// atualizar
router.put('/:id', auth, userController.put);

// remover
router.delete('/:id', auth, userController.delete);


module.exports = router;
