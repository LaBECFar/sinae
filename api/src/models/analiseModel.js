var mongoose = require('mongoose');

var Schema   = mongoose.Schema;

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
	}
},{
    timestamps: true
});

module.exports = mongoose.model('analise', analisesSchema);
