const mongoose = require('mongoose')
const fs = require('fs')
const Schema   = mongoose.Schema

const framesSchema = new Schema({

    'analiseId' : {
        type: String,
        required: true
    },

    // tempo em milisegundos
    'tempoMilis': {
        type: Number,
        required: true
    },

    'url' : {
		type: String,
		required: true
    },
    
    'quadrante' : {
        type: Number,
		required: true
    },

    'processado' : {
        type: Boolean,
        required: false,
        default: false
    },

	'pocos' : [{
        'nome' : {
            type: String,
            required: true
        },
    
        'url' : {
            type: String,
            required: true
        },
   }],

},{
    timestamps: true
});

framesSchema.methods.removerArquivos = function() { 
    // remover imagens de poços
    if(this.pocos && this.pocos.length > 0){
        this.pocos.forEach((poco) => {
            fs.unlinkSync(poco.url)
        })
    }

    // remover imagem do frame
    if(this.url) {
        fs.unlinkSync(this.url)
    }
}

module.exports = mongoose.model('frame', framesSchema);
