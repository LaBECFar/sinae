const mongoose = require('mongoose');
const frameModel = require("./frameModel")
var Schema = mongoose.Schema;

const analisesSchema = new Schema({
    'placa': {
        type: String,
        required: true
    },

    'fps' : {
        type: Number,
        required: true,
        default: 1
    },

    'tempo': {
        type: String,
        required: true
    },

    'experimentoCodigo' : {
		type: String,
		required: true
    },
    
    'dataColeta' : {
        type: Date,
        required: true
    }
},{
    timestamps: true
});



analisesSchema.methods.deleteFrames = function() { 

    frameModel.find({analiseId: this._id}, {url: 1, pocos:1})
        .then(frames => {
            frames.forEach((frame) => {
                frame.removerArquivos()
            })

            // remove todos os frames dessa analise do banco de dados
            frameModel.deleteMany({ analiseId: this._id })
        })
        .catch(err => {
            console.log(err.errors)
        }); 
}

module.exports = mongoose.model('analise', analisesSchema);
