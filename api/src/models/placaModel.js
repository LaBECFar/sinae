var mongoose = require("mongoose");
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
