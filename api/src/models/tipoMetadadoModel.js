var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const tipoMetadadoSchema = new Schema(
	{
		nome: {
			type: String,
			required: true
		},

		descricao: {
			type: String
		},

		createdBy: {
			type: String
		}
	},
	{
		timestamps: true
	}
)

var tipoMetadadoModel = mongoose.model('tipoMetadado', tipoMetadadoSchema)

// Dropping an Index in MongoDB (unique name)
tipoMetadadoModel.collection.dropIndex('nome_1', function(err){
	if(!err){
		console.log("tipometadado index nome_1 removido.")
	}
})


module.exports = tipoMetadadoModel;
