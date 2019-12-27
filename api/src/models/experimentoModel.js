var mongoose = require('mongoose');
const moment = require('moment')

const analiseSchema = require('./analiseModel').schema;

var Schema   = mongoose.Schema;

const experimentosSchema = new Schema({
	'codigo' : {
		type: String,
		required: true
	},

	'label' : {
		type: String,
		required: true
	},

	'analises' : [analiseSchema]
},{
	timestamps: true
});

module.exports = mongoose.model('experimento', experimentosSchema);
