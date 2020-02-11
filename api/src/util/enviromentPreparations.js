const userModel = require("../models/userModel")

const enviromentPreparations = {
    check()  {
        this.checkAdminUser()
        this.checkTmpFolder()
    },

    // Cria a pasta /uploads/tmp
    checkTmpFolder() {
        const fs = require('fs');
        const dirs = [
            '/usr/uploads/tmp/',
            '/usr/uploads/experimentos/'
        ];

        dirs.forEach((dir) => {
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
                console.log('Diretório '+dir+' criado!')
            }
        })
        
    },

    // Criado um usuário padrão caso nenhum esteja cadastrado
    checkAdminUser() {
        userModel.find() 
        .then(users => {
            if(!users || users.length == 0){
                const user = new userModel({
                    name: "Administrador",
                    email: process.env.DEFAULT_USER_EMAIL,
                    password: userModel.cryptoPass(process.env.DEFAULT_USER_PASSWORD),
                    isAdmin: true
                })
                
                user.save((err, user) => {
                    if (err) console.log('Erro ao criar usuário padrão')
                    console.log("Usuário padrão criado com sucesso!")
                })
            }
        })
        .catch(err => {
            console.log(err.errors)
        });  
    }
}


module.exports = enviromentPreparations
