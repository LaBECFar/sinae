var mongoose = require("mongoose")
const analiseModel = require("./analiseModel")
const analiseSchema = analiseModel.schema
var Schema = mongoose.Schema
const shortid = require("shortid")

const experimentosSchema = new Schema(
	{
		codigo: {
			type: String,
			required: true,
			unique: true,
			default: shortid.generate,
		},

		label: {
			type: String,
			required: true,
		},

		analises: [analiseSchema],

		createdBy: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

experimentosSchema.methods.deleteAnalises = function () {
	const dir = `/usr/uploads/experimentos/${this.codigo}`
	const fs = require("fs")
	const rimraf = require("rimraf")

	analiseModel
		.find({experimentoCodigo: this.codigo})
		.then((analises) => {
			// remover todos os frames vinculados ao experimento
			analises.forEach((analise) => {
				analise.deleteFrames(false)
			})

			// remove o diretório completo de arquivos do experimento
			if (fs.existsSync(dir)) {
				rimraf(dir, function (error) {
					if (error) console.log(error)
				})
			}

			// remove todas as analises desse experimento do banco de dados
			analiseModel.deleteMany({experimentoCodigo: this.codigo})
		})
		.catch((err) => {
			console.log(err.errors)
		})
}


let experimentoModel = mongoose.model("experimento", experimentosSchema)

// Dropping an Index in MongoDB (unique name)
experimentoModel.collection.dropIndexes(['analises.metadados.metadado.nome','analises.metadados.nome','analises.pocosMetadados.metadados.metadado.nome'], function(err){
	if(!err){
		console.log("experimento index analises.metadados.metadado.nome removido.")
	}
})


module.exports = experimentoModel
