var mongoose = require("mongoose");
//const experimentoModel = require("./experimentoModel")
var Schema = mongoose.Schema;

const placaSchema = new Schema(
	{
		label: {
			type: String,
			required: true
		},

		experimentoCodigo: {
			type: String
		},

		experimento: {
			type: Schema.Types.ObjectId, 
			ref: 'experimento' 
		},

		pocos: [
			{
				nome: {
					type: String,
					required: true
				},

				metadados: [
					{
						nome: {
							type: String,
							required: true
						},

						valor: {
							type: String
						}
					}
				]
			}
		],

		createdBy : {
			type: String
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("placa", placaSchema);
