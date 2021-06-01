var mongoose = require("mongoose")
const analiseModel = require("./analiseModel")
const userModel = require("./userModel")
const analiseSchema = analiseModel.schema
var Schema = mongoose.Schema
const shortid = require("shortid")
const fileHelper = require("../helpers/fileHelper")

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

		creator: { 
			type: Schema.Types.ObjectId, 
			ref: 'user' 
		}
	},
	{
		timestamps: true,
	}
)

experimentosSchema.methods.deleteAnalises = function () {
	const dir = `/usr/uploads/experimentos/${this.codigo}`

	analiseModel
		.find({experimentoCodigo: this.codigo})
		.then((analises) => {
			// remover todos os frames vinculados ao experimento
			analises.forEach((analise) => {
				analise.deleteFrames(false)
			})

			// remove o diretório completo de arquivos do experimento
			fileHelper.removeDir(dir)

			// remove todas as analises desse experimento do banco de dados
			analiseModel.deleteMany({experimentoCodigo: this.codigo})
		})
		.catch((err) => {
			console.log(err.errors)
		})
}

experimentosSchema.methods.getCreator = async function() {
	return await userModel.findById(this.createdBy)
}


let experimentoModel = mongoose.model("experimento", experimentosSchema)

// Dropping an Index in MongoDB (unique name)
experimentoModel.collection.dropIndexes(['analises.metadados.metadado.nome','analises.metadados.nome','analises.pocosMetadados.metadados.metadado.nome'])


module.exports = experimentoModel
