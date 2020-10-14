const mongoose = require("mongoose");
const frameModel = require("./frameModel");

var Schema = mongoose.Schema;

const analisesSchema = new Schema(
	{
		placa: {
			type: String,
			required: true
		},

		fps: {
			type: Number,
			required: true,
			default: 1
		},

		tempo: {
			type: String,
			required: true
		},

		experimentoCodigo: {
			type: String,
			required: true
		},

		dataColeta: {
			type: Date,
			required: true
		},

		video: {
			type: String
		},

		motilityResults: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

analisesSchema.methods.deleteFrames = function(removeFiles = true) {
	if (removeFiles) {
		const dir = `/usr/uploads/experimentos/${this.experimentoCodigo}/${this.placa}/${this.tempo}`;
		const fs = require("fs");
		const rmdir = require("rimraf");

		// remove diretório onde ficam os arquivos da analise
		if (fs.existsSync(dir)) {
			rmdir(dir, function(error) {
				if (error) console.log(error);
			});
		}
	}

	// remove todos os frames dessa analise do banco de dados
	frameModel.deleteMany({ analiseId: this._id });
}

module.exports = mongoose.model("analise", analisesSchema);
