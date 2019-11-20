var mongoose = require('mongoose');

var Schema   = mongoose.Schema;

const analisesSchema = new Schema({
    'fps' : {
        type: Number,
        required: true,
        default: 1
    },

    'tempo': {
        type: String,
        required: true
    },

    'codigoExperimento' : {
		type: String,
		required: true
	},
},{
    timestamps: true
});

module.exports = mongoose.model('analise', analisesSchema);
