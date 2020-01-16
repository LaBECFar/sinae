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
            
            if(user.password == userModel.cryptoPass(password)) {
                const token = user.generateAuthToken();

                return res.status(201).json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token,
                    isAdmin: user.isAdmin ? user.isAdmin : false
                });

            } else {
                return res.status(401).json({ error: true, message: "Senha inválida" });
            }
        })
    },

    tokenUserInfo: (req, res, next) => {
        return res.status(201).json(req.teste);
    },

    list: (req, res, next) => {
        userModel.find() 
            .then(users => {
                return res.status(201).json(users);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });        
    },

    get: (req, res, next) => {
        let id = req.params.id;

        userModel.findById(id)
            .then(user => {
                return res.status(201).json(user);
            })
            .catch(err => {
                return res.status(422).send(err.errors);
            });                    
    },

    getByEmail: (req, res, next) => {
        let email = req.params.email;

        userModel.findOne({ email: email }, (err, user) => {
            if(!user){
                return res.status(404).json({ error: true, message: "Usuário não encontrado" });
            }

            if(err){
                return res.status(422).send(err.errors);
            }

            return res.status(201).json(user);
        })                  
    },


    post: (req, res, next) => {
        const { name, email, password } = req.body;

        const user = new userModel({
            name: name,
            email: email,
            password: userModel.cryptoPass(password)
        })
        
        user.save((err, user) => {
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao criar usuário',
                    error: err,
                    success: false
                });
            }
            return res.status(201).json(user);
        })
    },


    put: (req, res, next) => {
        var id = req.params.id;

        userModel.findById(id)
            .populate('users')
            .exec()
            .then((user) => {
                if (!user) {
                    return res.status(404).send()
                }

                const {name, email, password} = req.body

                user.name = name
                user.password = userModel.cryptoPass(password)

                user.save(function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Erro ao atualizar usuário.',
                            error: err,
                            success: false
                        });
                    }
                    return res.status(201).json(user);
                })
            })
    },
    
    delete: (req, res, next) => {
        let id = req.params.id;
        userModel.deleteOne({_id: id},function(err, user){
            if (err) {
                return res.status(500).json({
                    message: 'Erro ao deletar usuário.',
                    error: err,
                    success: false
                });
            }
            return res.status(201).json(user);
        })
    }


}


module.exports = userController