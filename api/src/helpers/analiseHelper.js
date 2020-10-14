const analiseModel = require("../models/analiseModel")
const frameModel = require("../models/frameModel")
const fs = require("fs")
const placaModel = require("../models/placaModel")
const csv = require("csv-parser")
const {Parser} = require("json2csv")
const csvHelper = require("./csvHelper")
const placaHelper = require("./placaHelper")

const analiseHelper = {
	generateFilelist: async (analiseId) => {
		const list = await analiseHelper.getPocosFilelist(analiseId)
		const analise = await analiseModel.findById(analiseId)
		const path = analiseHelper.getAnaliseLocation(analise)
		const filelist = `${path}filelist.csv`
		fs.writeFileSync(filelist, list.join("\n"))
	},

	generatePrevNextList: async (analiseId) => {
		const analise = await analiseModel.findById(analiseId)
		const milisIncrement = Math.floor(1000 / analise.fps)

		const previousList = await analiseHelper.getPocosFilelist(analiseId)
		let list = []

		previousList.forEach((url, index) => {
			const milis = url.substring(
				url.lastIndexOf("/") + 5,
				url.lastIndexOf("_seg.")
			)
			const nextMilis = parseInt(milis) + milisIncrement

			const nextUrl = url.replace(
				"_" + milis + "_seg.",
				"_" + nextMilis + "_seg."
			)

			list.push({
				prev: url,
				next: nextUrl,
			})
		})

		const json2csvParser = new Parser({
			fields: [
				{label: "Previous", value: "prev"},
				{label: "Next", value: "next"},
			],
			quote: "",
			delimiter: ",",
		})

		const csv = json2csvParser.parse(list)

		fs.writeFileSync(
			analiseHelper.getAnaliseLocation(analise) + "prevnext.csv",
			csv
		)
	},

	getPrevNext: async () => {
		const frames = await frameModel.find(
			{analiseId},
			["pocos", "tempoMilis"],
			{sort: {tempoMilis: 1}}
		)

		const pocos = []

		frames.forEach((frame, index) => {
			const nextFrame = frames[index + 1]

			frame.pocos.forEach((poco) => {
				const nextPoco = nextFrame
			})
		})
	},

	getAnaliseLocation: (analise) => {
		return `/usr/uploads/experimentos/${analise.experimentoCodigo}/${analise.placa}/${analise.tempo}/`
	},

	getPocosFilelist: async (analiseId) => {
		const frames = await frameModel.find(
			{analiseId},
			["pocos", "tempoMilis"],
			{
				sort: {tempoMilis: 1},
			}
		)

		let list = []

		frames.forEach((frame) => {
			frame.pocos.map((poco) =>
				list.push(`file://${poco.url.replace(".", "_seg.")}`)
			)
		})

		return list.sort()
	},

	getMotilityResultsFiles: (analise) => {
		const path = analiseHelper.getAnaliseLocation(analise)
		const pathContent = fs.readdirSync(path)
		const prefix = "MyExpt_"
		const files = pathContent
			.filter((file) => file.indexOf(prefix) == 0)
			.map((file) => `${path}${file}`)
		return files
	},

	isMotilityProcessorFinished: async (analise) => {
		let exists = true

		if(!analise.motilityResults){
			const files = analiseHelper.getMotilityResultsFiles(analise)
			files.forEach((filepath) => {
				if (!fs.existsSync(filepath)) {
					exists = false
				}
			})
		}

		return exists
	},

	mergeMetadataToResults: async (analise, finishedCallback) => {
		const placa = await placaModel.findOne({
			label: analise.placa,
			experimentoCodigo: analise.experimentoCodigo,
		})
		const metadados = placaHelper.getWellsMetadata(placa)
		const files = analiseHelper.getMotilityResultsFiles(analise)

		let dataArray = []
		let count = 0

		files.forEach((file) => {
			fs.createReadStream(file)
				.pipe(csv())
				.on("data", function (data) {
					const filename = data["FileName_Previous"]
					const wellName = analiseHelper.getWellFromFilename(filename)
					const wellMetadados = metadados[wellName]

					data["Metadata_Well"] = wellName
					data["Metadata_ExperimentCode"] = analise.experimentoCodigo
					data["Metadata_Plate"] = analise.placa
					data["Metadata_Time"] = analise.tempo

					if (wellMetadados) {
						wellMetadados.forEach((metadado) => {
							const column = "Metadata_" + metadado.nome
							data[column] = metadado.valor
						})
						dataArray.push(data)
					}
				})
				.on("end", function () {
					const fields = Object.keys(dataArray[0])
					csvHelper.dataToCsv(file, dataArray, fields)

					count += 1
					if (count >= files.length) {
						finishedCallback(files)
					}
				})
		})
	},

	getWellFromFilename: (filename) => {
		let nomePoco = filename.split("_")
		nomePoco = nomePoco[0]
		let letter = nomePoco.slice(0, 1)
		let number = parseInt(nomePoco.slice(1))
		nomePoco = `${letter}${number}`
		return nomePoco
	},


}

module.exports = analiseHelper
