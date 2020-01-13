const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel")

const userController = {
    login: (req, res, next) => {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(401).json({ error: true, message: "O e-mail e/ou senha não foram informados" })
        }
        
        userModel.findOne({ email: email }, (err, user) => {
            if(err){
                return res.status(401).json({ error: true, message: "Não foi possível fazer login" });
            }

            if(!user){
                return res.status(404).json({ error: true, message: "Usuário não encontrado" });
            }
            
            if(user.password == password) {
                jwt.sign({email: email}, process.env.TOKEN_SECRET, { expiresIn: '30d' }, (err, token) => {
                    if(err) { 
                        return res.status(401).json({ error: true, message: "Não foi possível fazer login" });
                    }    

                    return res.status(201).json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token
                    });
                });
            } else {
                return res.status(401).json({ error: true, message: "Senha inválida" });
            }
        })
    }
}


module.exports = userController