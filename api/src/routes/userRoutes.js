const express = require('express');
const auth = require('./auth');
const router = express.Router();
const userController = require('../controllers/userController')


router.post('/login', userController.login);

router.get('/', auth, userController.list);

// detalhes usuario que fez login
router.get('/info', auth, userController.tokenUserInfo);

router.get('/:id', auth, userController.get);

router.get('/email/:email', auth, userController.getByEmail);

router.post('/', auth, userController.post);

router.put('/:id', auth, userController.put);

router.delete('/:id', auth, userController.delete);



module.exports = router;
