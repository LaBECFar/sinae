var mongoose = require('mongoose');
const analiseModel = require("./analiseModel")
const analiseSchema = analiseModel.schema;
var Schema   = mongoose.Schema;

const experimentosSchema = new Schema({
	'codigo' : {
		type: String,
		required: true,
		unique: true
	},

	'label' : {
		type: String,
		required: true
	},

	'analises' : [
		analiseSchema
	],

	'createdBy' : {
		type: String
	}
},{
	timestamps: true
});

experimentosSchema.methods.deleteAnalises = function() { 

    analiseModel.find({ experimentoId: this._id })
		.then(analises => {
			analises.forEach((analise) => {
				analise.deleteFrames()
			});

			analiseModel.deleteMany({ experimentoId: this._id })
		})
		.catch(err => {
			console.log(err.errors)
		}); 
}

module.exports = mongoose.model('experimento', experimentosSchema);
