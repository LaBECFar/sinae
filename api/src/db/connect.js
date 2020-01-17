const mongoose = require('mongoose')
const userModel = require("../models/userModel")

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to Database");
    checkAdminUser();
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


// Na primera execução da api é criado um usuário padrão caso nenhum esteja cadastrado
function checkAdminUser(){
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

module.exports = mongoose
