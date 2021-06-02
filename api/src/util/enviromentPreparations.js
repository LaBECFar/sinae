const userModel = require("../models/userModel")
const ObjectId = require('mongodb').ObjectID;
const experimentoModel = require("../models/experimentoModel")
const placaModel = require("../models/placaModel")

const enviromentPreparations = {
    check()  {
        this.checkAdminUser()
        this.checkTmpFolder()
        this.addExperimentCreator()
        this.addExperimentoToPlaca()
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
    },

    // Criado um usuário padrão caso nenhum esteja cadastrado
    addExperimentCreator() {
        let count = 0
        experimentoModel.find() 
            .then(experimentos => {
                experimentos.forEach(experimento => {
                    if(!experimento.creator && experimento.createdBy) {
                        experimento.creator = new ObjectId(experimento.createdBy)
                        experimento.save()
                        count++
                    }
                })

                if(count > 0 ){
                    console.log("Experimentos com criadores ajustados")
                }
            })
            .catch(err => {
                console.log(err.errors)
            });  
    },

    // Criado um usuário padrão caso nenhum esteja cadastrado
    addExperimentoToPlaca() {
        placaModel.find()
            .then(placas => {
                placas.forEach(placa => {
                    if(!placa.experimento && placa.experimentoCodigo) {
                        experimentoModel.findOne({ codigo: placa.experimentoCodigo })
                            .then(experimento => {
                                if(experimento){
                                    placa.experimento = new ObjectId(experimento._id)
                                    placa.save()
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });      
                        
                    }
                })
            })
            .catch(err => {
                console.log(err)
            });  
    }
}


module.exports = enviromentPreparations
