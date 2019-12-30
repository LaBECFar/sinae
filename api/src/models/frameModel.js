var mongoose = require('mongoose');

var Schema   = mongoose.Schema;

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
    }
},{
    timestamps: true
});

module.exports = mongoose.model('frame', framesSchema);
