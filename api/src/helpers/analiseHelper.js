const fs = require("fs")
const placaModel = require("../models/placaModel")
const csvHelper = require("./csvHelper")
const placaHelper = require("./placaHelper")
const frameHelper = require("./frameHelper")
const fileHelper = require("./fileHelper")
const dockerHelper = require("./dockerHelper")
const csv = require("fast-csv")
const {default: PQueue} = require("p-queue")
const settings = require("../../config/settings.json")
const experimentoModel = require("../models/experimentoModel")

const analiseHelper = {
	generateFilelists: async (analise) => {
		const analiseId = analise._id
		const analisePath = analise.getLocation()
		const frames = await frameHelper.getFrames({analiseId}, [
			"pocos",
			"tempoMilis",
		])
		const wells = frameHelper.getWells(frames)

		wells.forEach((wellName) => {
			const list = frameHelper.getWellFilelist(wellName, frames)
			const file = `${analisePath}cellprofiler/${wellName}/filelist.csv`
			fileHelper.saveFile(file, list.join("\n"))
		})
	},

	generatePrevnexts: async (analise) => {
		const analiseId = analise._id
		const frames = await frameHelper.getFrames({analiseId}, [
			"pocos",
			"tempoMilis",
		])
		const wells = frameHelper.getWells(frames)
		const milisIncrement = Math.floor(1000 / analise.fps)

		await wells.forEach(async (wellName) => {
			const previousList = frameHelper.getWellFilelist(wellName, frames)
			let list = []

			previousList.forEach((prev) => {
				const milis = prev.substring(
					prev.lastIndexOf("/") + 5,
					prev.lastIndexOf("_seg.")
				)
				const nextMilis = parseInt(milis) + milisIncrement
				const next = prev.replace(
					`_${milis}_seg.`,
					`_${nextMilis}_seg.`
				)
				list.push({Previous: prev, Next: next})
			})

			const analisePath = analise.getLocation()
			const file = `${analisePath}cellprofiler/${wellName}/prevnext.csv`

			await csvHelper.writeToPath(file, list)
		})
	},

	getMotilityResultsFiles: (analise) => {
		const path = analise.getLocation()
		const prefix = "MyExpt_"
		const pathContent = fs.readdirSync(path)
		return pathContent
			.filter((file) => file.indexOf(prefix) == 0)
			.map((file) => `${path}${file}`)
	},

	isMotilityProcessorFinished: async (analise) => {
		let exists = true

		if (analise.pocosProcessados.length < 60) {
			exists = false
		} else {
			const wells = await analiseHelper.getAnaliseWells(analise)
			const files = analiseHelper.getMotilityResultsFiles(analise)

			if (files.length < wells.length * 2) {
				exists = false
			}

			files.forEach((filepath) => {
				if (!fs.existsSync(filepath)) {
					exists = false
				}
			})
		}

		return exists
	},

	getAnaliseWells: async (analise) => {
		const analiseId = analise._id
		const frames = await frameHelper.getFrames({analiseId}, [
			"pocos",
			"tempoMilis",
		])
		return frameHelper.getWells(frames)
	},

	getMotilityFiles: (path) => {
		const prefix = "MyExpt_"
		const allFiles = fs.readdirSync(path)
		return allFiles
			.filter((file) => file.indexOf(prefix) == 0)
			.map((file) => `${path}${file}`)
	},

	mergeMotilityFiles: async (analise) => {
		const wells = await analiseHelper.getAnaliseWells(analise)
		const path = analise.getLocation()
		const files = []

		wells.forEach((wellName) => {
			const wellPath = `${path}cellprofiler/${wellName}/`
			const wellFiles = analiseHelper.getMotilityFiles(wellPath)
			files.push(...wellFiles)
		})

		await csvHelper.mergeFiles(
			files.filter((f) => f.indexOf("_Image") > 0),
			`${path}MyExpt_Image.csv`
		)

		await csvHelper.mergeFiles(
			files.filter((f) => f.indexOf("_FilterObjects_Previous") > 0),
			`${path}MyExpt_FilterObjects_Previous.csv`
		)
	},

	getMetadataNames: (metadados) => {
		let headers = []
		for (m in metadados) {
			metadados[m].forEach((metadado) => {
				headers.push(metadado.nome)
			})
		}
		return [...new Set(headers)]
	},

	mergeMetadataToFile: (file, analise, metadados) => {
		return new Promise((resolve) => {
			let dataArray = []
			let metadataHeaders = analiseHelper.getMetadataNames(metadados)

			csv.parseFile(file, {headers: true})
				.on("error", (error) => console.error(error))
				.on("data", (row) => {
					const filename = row["FileName_Previous"]
					const wellName = analiseHelper.getWellFromFilename(filename)

					row["Metadata_Well"] = wellName
					row["Metadata_ExperimentCode"] = analise.experimentoCodigo
					row["Metadata_Plate"] = analise.placa
					row["Metadata_Time"] = analise.tempo

					// add headers to all rows even if empty to be sure the columns will be in the csv
					metadataHeaders.forEach((name) => {
						row[`Metadata_${name}`] = ""
					})

					// then (re)add existing values
					const wellMetadados = metadados[wellName]
					if (wellMetadados) {
						wellMetadados.forEach((metadado) => {
							row["Metadata_" + metadado.nome] = metadado.valor
						})
					}

					// updated row
					dataArray.push(row)
				})
				.on("end", () =>
					csvHelper
						.writeToPath(file, dataArray)
						.then((file) => resolve(file))
				)
		})
	},

	mergeMetadataToResults: async (analise) => {
		const experimento = await experimentoModel.findOne({codigo: analise.experimentoCodigo})
		
		const placa = await placaModel.findOne({
			label: analise.placa,
			experimentoCodigo: analise.experimentoCodigo,
			createdBy: experimento.createdBy
		})

		let metadados = []

		if(placa){
			metadados = placaHelper.getWellsMetadata(placa)
		}

		const files = analiseHelper.getMotilityResultsFiles(analise)

		for (const file of files) {
			await analiseHelper.mergeMetadataToFile(file, analise, metadados)
		}
	},

	getWellFromFilename: (filename) => {
		let nomePoco = filename.split("_")
		nomePoco = nomePoco[0]
		let letter = nomePoco.slice(0, 1)
		let number = parseInt(nomePoco.slice(1))
		nomePoco = `${letter}${number}`
		return nomePoco
	},

	startMotilityProcessors: async (analise) => {
		const maxSimultaneousContainers =
			parseInt(settings.maxMotilityContainers) || 2
		const analiseId = analise._id
		const frames = await frameHelper.getFrames({analiseId}, [
			"pocos",
			"tempoMilis",
		])
		const wells = frameHelper.getWells(frames)

		const queue = new PQueue({concurrency: maxSimultaneousContainers})
		wells.forEach((wellName) => {
			if (!analise.pocosProcessados.includes(wellName)) {
				queue.add(() =>
					analiseHelper.startWellMotilityProcessor(wellName, analise)
				)
			}
		})
	},

	startWellMotilityProcessor: async (wellName, analise) => {
		const projectLocation = "/usr/uploads/settings/pipelines.cpproj"
		const analiseLocation = analise.getLocation()
		const outputLocation = `${analiseLocation}cellprofiler/${wellName}/`
		const filelistLocation = `${outputLocation}filelist.csv`
		const executeComand = `cellprofiler -c -p ${projectLocation} --file-list ${filelistLocation} -o ${outputLocation}`
		const startupParameters = executeComand.split(" ")

		return await new Promise((resolve) => {
			dockerHelper
				.runImage("cellprofiler_processor", startupParameters)
				.then(() => {
					if (analise.pocosProcessados) {
						analise.pocosProcessados.push(wellName)
						await analise.save()
					}
					resolve()
				})
		})
	},

	resetProcessedMotility: (analise) => {
		analise.pocosProcessados = []
		analise.save()
		const pathToRemove = `${analise.getLocation()}cellprofiler/`
		fileHelper.removeDir(pathToRemove)
	},
}

module.exports = analiseHelper
