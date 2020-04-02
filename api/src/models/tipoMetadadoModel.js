var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const tipoMetadadoSchema = new Schema(
	{
		nome: {
			type: String,
			required: true,
			unique: true
		},

		descricao: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("tipoMetadado", tipoMetadadoSchema);
