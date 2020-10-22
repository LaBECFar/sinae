const mongoose = require("mongoose")
const fileHelper = require("../helpers/fileHelper")
const frameModel = require("./frameModel")

var Schema = mongoose.Schema

const analisesSchema = new Schema(
	{
		placa: {
			type: String,
			required: true,
		},

		fps: {
			type: Number,
			required: true,
			default: 1,
		},

		tempo: {
			type: String,
			required: true,
		},

		experimentoCodigo: {
			type: String,
			required: true,
		},

		dataColeta: {
			type: Date,
			required: true,
		},

		video: {
			type: String,
		},

		pocosProcessados: [String],
	},
	{
		timestamps: true,
	}
)

analisesSchema.methods = {
	deleteFrames: function (removeFiles = true) {
		if (removeFiles) {
			const dir = this.getLocation()
			fileHelper.removeDir(dir)
		}
	
		// remove todos os frames dessa analise do banco de dados
		frameModel.deleteMany({analiseId: this._id})
	},

	getLocation: function() {
		return `/usr/uploads/experimentos/${this.experimentoCodigo}/${this.placa}/${this.tempo}/`
	}
}

module.exports = mongoose.model("analise", analisesSchema)
