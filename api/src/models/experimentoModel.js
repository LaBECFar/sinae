var mongoose = require('mongoose');
// var locationModel = require('./locationModel')

var Schema   = mongoose.Schema;

var experimentosSchema = new Schema({
	'codigo' : {
		type: String,
		required: true
	},
	'label' : {
		type: String,
		required: true
	}
	//'analises' : [Schema.Types.analise]
},{
	timestamps: true
});

module.exports = mongoose.model('experimento', experimentosSchema);
