const analiseModel = require("../models/analiseModel")
const moment = require("moment")
const frameModel = require("../models/frameModel")
const placaModel = require("../models/placaModel")
const fs = require("fs")
const archiver = require("archiver")
const path = require("path")
const {Parser} = require("json2csv")
const formidable = require("formidable")
const ffmpeg = require("fluent-ffmpeg")
const analiseHelper = require("../helpers/analiseHelper")
const dockerHelper = require("../helpers/dockerHelper")
const fileHelper = require("../helpers/fileHelper")
const timeHelper = require("../helpers/timeHelper")

const analiseController = {
	list: (req, res, next) => {
		let search = {}

		if (req.params.experimentoCodigo) {
			search.experimentoCodigo = req.params.experimentoCodigo
		} else {
			if (req.query.experimentoCodigo) {
				search.experimentoCodigo = req.query.experimentoCodigo
			}
		}

		analiseModel
			.find(search, {
				fps: 1,
				tempo: 1,
				experimentoCodigo: 1,
				placa: 1,
				dataColeta: 1
			})
			.then((analises) => {
				return res.status(201).json(analises)
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	get: (req, res, next) => {
		let id = req.params.id

		analiseModel
			.findById(id)
			.then(async (analise) => {
				let obj = analise.toObject()
				obj.idserver = analise._id

				obj[
					"isMotilityProcessorFinished"
				] = await analiseHelper.isMotilityProcessorFinished(analise)

				aux_quadrante = 0
				idPrimeiroFrame = []

				frameQuadrante = []
				frameQuadrante[1] = {qtd: 0, processados: 0, quadrante: 1}
				frameQuadrante[2] = {qtd: 0, processados: 0, quadrante: 2}
				frameQuadrante[3] = {qtd: 0, processados: 0, quadrante: 3}
				frameQuadrante[4] = {qtd: 0, processados: 0, quadrante: 4}

				frameModel
					.find({analiseId: obj._id})
					.then((frames) => {
						let processados = 0
						let total = 0
						frames.forEach((element) => {
							total++
							frameQuadrante[element.quadrante].qtd++
							if (element.processado) {
								processados++
								frameQuadrante[element.quadrante].processados++
							}

							if (aux_quadrante != element.quadrante) {
								aux_quadrante = element.quadrante
								idPrimeiroFrame.push({
									quadrante: aux_quadrante,
									idFrame: element._id,
								})
							}
						})

						obj["framesTotal"] = total
						obj["framesProcessados"] = processados
						obj["idPrimeiroFrame"] = idPrimeiroFrame
						obj["frameQuadrante"] = frameQuadrante

						return res.status(201).json(obj)
					})
					.catch((err) => {
						return res.status(422).send(err.errors)
					})
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	post: (req, res, next) => {
		let dataColeta = req.body.dataColeta
		if (dataColeta) {
			dataColeta = moment(dataColeta, "YYYY-MM-DD").toDate()
		}

		const analise = new analiseModel({
			tempo: req.body.tempo,
			fps: req.body.fps || 1,
			experimentoCodigo: req.body.experimentoCodigo,
			placa: req.body.placa,
			dataColeta: dataColeta,
		})

		placaModel
			.find({
				experimentoCodigo: analise.experimentoCodigo,
				label: analise.placa,
			})
			.then((placas) => {
				if (placas.length <= 0) {
					const placa = new placaModel({
						experimentoCodigo: analise.experimentoCodigo,
						label: analise.placa,
						pocos: [],
					})

					placa.save((err, placa) => {
						if (err) {
							console.log(
								"Erro ao criar placa automaticamente. " + err
							)
						}
					})
				}
			})
			.catch((err) => {
				console.log("Erro ao criar placa automaticamente. ")
			})

		analise.save((err, analise) => {
			if (err) {
				return res.status(500).json({
					message: "Erro ao criar analise",
					error: err,
					success: false,
				})
			}

			let obj = analise.toObject()
			obj.idserver = analise._id

			return res.status(201).json(obj)
		})
	},

	put: (req, res, next) => {
		const id = req.params.id
		const that = this

		analiseModel
			.findById(id)
			.populate("analises")
			.exec()
			.then((analise) => {
				if (!analise) {
					return res.status(404).send()
				}

				/**
				 * @todo validar se o usuário que está atualizando o experimento
				 * é o mesmo que criou o experimento.
				 */

				var dataColeta = req.body.dataColeta

				if (dataColeta) {
					dataColeta = moment(dataColeta, "DD/MM/YYYY").toDate()
				}

				if (typeof req.body.tempo !== "undefined")
					analise.tempo = req.body.tempo
				if (typeof req.body.fps !== "undefined")
					analise.fps = req.body.fps
				if (typeof req.body.dataColeta !== "undefined")
					analise.dataColeta = dataColeta
				if (typeof req.body.experimentoCodigo !== "undefined")
					analise.experimentoCodigo = req.body.experimentoCodigo

				if (typeof req.body.placa !== "undefined") {
					analise.placa = req.body.placa
					placaModel
						.find({
							experimentoCodigo: analise.experimentoCodigo,
							label: analise.placa,
						})
						.then((placas) => {
							if (placas.length <= 0) {
								const placa = new placaModel({
									experimentoCodigo:
										analise.experimentoCodigo,
									label: analise.placa,
									pocos: [],
								})

								placa.save((err, placa) => {
									if (err) {
										console.log(
											"Erro ao criar placa automaticamente. " +
												err
										)
									}
								})
							}
						})
						.catch((err) => {
							console.log("Erro ao criar placa automaticamente. ")
						})
				}

				analise.save(function (err, analise) {
					if (err) {
						return res.status(500).json({
							message: "Erro ao atualizar analise.",
							error: err,
							success: false,
						})
					}
					return res.status(201).json(analise)
				})
			})
	},

	delete: (req, res, next) => {
		let id = req.params.id

		analiseModel.findOneAndDelete({_id: id}, function (err, analise) {
			if (err) {
				return res.status(500).json({
					message: "Erro ao deletar analise.",
					error: err,
					success: false,
				})
			}

			analise.deleteFrames()
			analise.deleted = true

			return res.status(201).json(analise)
		})
	},

	downloadFrames: (req, res, next) => {
		let search = {}
		if (req.params.id) {
			search.analiseId = req.params.id
		}

		frameModel
			.find(search, {
				url: 1,
			})
			.then((frames) => {
				let path_zip_folder = "/usr/uploads/tmp/"
				let path_zip_file = path.join(
					path_zip_folder,
					`/${search.analiseId}.zip`
				)

				if (fs.existsSync(path_zip_file)) {
					fs.unlinkSync(path_zip_file)
				}
				var output = fs.createWriteStream(path_zip_file)

				var archive = archiver("zip", {
					gzip: true,
					zlib: {level: 9}, // compression level.
				})
				archive.on("error", (err) => {
					console.log("Erro ao criar zip")
					throw err
				})
				archive.pipe(output)

				// adiciona os frames ao zip
				for (let i = 0; i < frames.length; i++) {
					let frame = frames[i]
					if (fs.existsSync(frame.url)) {
						let filename = frame.url.replace(
							"/usr/uploads/experimentos",
							""
						)
						archive.file(frame.url, {name: filename})
					}
				}

				archive.finalize()
				res.attachment(path_zip_file)
				archive.pipe(res)
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	downloadPocos: (req, res, next) => {
		let search = {}
		if (req.params.id) {
			search.analiseId = req.params.id
		}

		frameModel
			.find(search, {
				pocos: 1,
			})
			.then((frames) => {
				let path_zip_folder = "/usr/uploads/tmp/"
				let path_zip_file = path.join(
					path_zip_folder,
					`/${search.analiseId}_pocos.zip`
				)

				if (fs.existsSync(path_zip_file)) {
					fs.unlinkSync(path_zip_file)
				}
				var output = fs.createWriteStream(path_zip_file)

				var archive = archiver("zip", {
					gzip: true,
					zlib: {level: 9}, // compression level.
				})
				archive.on("error", (err) => {
					console.log("Erro ao criar zip")
					throw err
				})
				archive.pipe(output)

				function appendPocoToArchive(filepath) {
					if (fs.existsSync(filepath)) {
						const filename = filepath.replace(
							"/usr/uploads/experimentos",
							""
						)
						archive.file(filepath, {name: filename})
					}
				}

				// adiciona os frames ao zip
				frames.forEach((frame) => {
					frame.pocos.forEach((poco) => {
						appendPocoToArchive(poco.url)
						appendPocoToArchive(
							poco.url.replace(/\.([^\.]*)$/, "_pred.$1")
						)
						appendPocoToArchive(
							poco.url.replace(/\.([^\.]*)$/, "_seg.$1")
						)
					})
				})

				archive.finalize()
				res.attachment(path_zip_file)
				archive.pipe(res)
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	extractPocos: (req, res, next) => {
		const id = req.params.id
		let quadrante = req.body.quadrante
		let pocos = req.body.pocos
		let raio = req.body.raio

		startupParameters = []
		startupParameters.push("python")
		startupParameters.push("process.py")
		startupParameters.push(quadrante)
		startupParameters.push(raio.toString())
		startupParameters.push(id)

		for (let i = 0; i < pocos.length; i++) {
			let poco = pocos[i]
			startupParameters.push(poco.nome)
			startupParameters.push(poco.top.toString())
			startupParameters.push(poco.left.toString())
		}

		dockerHelper.startImage("frame_processor", startupParameters)

		return res.status(201).json("1")
	},

	exportCsv: async (req, res, next) => {
		let search = {}
		if (req.params.id) {
			search.analiseId = req.params.id
		}

		// diretório onde os poços estão localizados na maquina do solicitante
		let dir = req.params.dir || req.query.dir || req.body.dir

		const analise = await analiseModel.findById(search.analiseId)

		frameModel
			.find(search, {
				tempoMilis: 1,
				pocos: 1,
				quadrante: 1,
			})
			.then((frames) => {
				// filtra os frames em quadrantes separados
				let quadrantes = [[], [], [], []]

				frames.forEach((frame) => {
					quadrantes[frame.quadrante - 1].push(frame)
				})

				let data = []
				let count = 0

				quadrantes.forEach((quadrante, qIndex) => {
					quadrante.forEach((frame, index) => {
						let isFirst = index == 0 ? 1 : 0
						let isLast = index == quadrante.length - 1 ? 1 : 0

						let previousPoco = frame.tempoMilis
						let previousFrame = quadrante[index - 1]

						if (previousFrame) {
							previousPoco = previousFrame.tempoMilis
						}

						// o primeiro frames (poços) não deve possuir um Previous_number
						if (isFirst) {
							previousPoco = ""
						}

						let next = null
						let prev = null

						if (index > 0) {
							prev = quadrante[index - 1]
						}

						if (index < quadrante.length - 1) {
							next = quadrante[index + 1]
						}

						frame.pocos.forEach((poco, pindex) => {
							let link = poco.url

							const prevLink = prev ? prev.pocos[pindex].url : ""
							const nextLink = next ? next.pocos[pindex].url : ""

							if (dir) {
								link = link.replace(
									"/usr/uploads/experimentos",
									dir
								)
							} else {
								link = link.split("\\").pop().split("/").pop() // remove path, restando apenas o nome do arquivo
							}

							if (fs.existsSync(poco.url)) {
								let item = {
									path: link,
									miliseconds: frame.tempoMilis,
									experiment: analise.experimentoCodigo,
									analysis: search.analiseId,
									well: poco.nome,
									plate: analise.placa,
									quadrant: frame.quadrante,
									time: analise.tempo,
									prev: prevLink,
									next: nextLink,
								}

								data.push(item)
								count++
							}
						})
					})
				})

				// value: nome do atributo do objeto e label: nome da coluna no arquivo csv
				const fields = [
					{
						label: "Path",
						value: "path",
					},
					{
						label: "Miliseconds",
						value: "miliseconds",
					},

					{
						label: "Experiment",
						value: "experiment",
					},

					{
						label: "Analysis",
						value: "analysis",
					},

					{
						label: "Time",
						value: "time",
					},

					{
						label: "Plate",
						value: "plate",
					},

					{
						label: "Quadrant",
						value: "quadrant",
					},

					{
						label: "Well",
						value: "well",
					},

					{
						label: "Previous",
						value: "prev",
					},
					{
						label: "Next",
						value: "next",
					},
				]

				const json2csvParser = new Parser({
					fields,
					quote: "",
					delimiter: ",",
				})
				const csv = json2csvParser.parse(data)

				analiseModel
					.findById(search.analiseId)
					.then((analise) => {
						res.attachment(
							analise.experimentoCodigo +
								"_" +
								analise.tempo +
								".csv"
						)
						return res.status(200).send(csv)
					})
					.catch((err) => {
						return res.status(422).send(err.errors)
					})
			})
			.catch((err) => {
				return res.status(422).send(err.errors)
			})
	},

	uploadVideo: (req, res, next) => {
		var form = new formidable.IncomingForm()
		form.keepExtensions = true
		form.uploadDir = "/usr/uploads/tmp/"

		const analiseId = req.params.id

		analiseModel.findById(analiseId).then((analise) => {
			form.parse(req, function (err, fields, files) {
				if (err) return res.status(422).send(err.errors)

				if (!files.file) {
					let errorMsg = "Arquivo não transferido"
					return res
						.status(500)
						.json({error: true, message: errorMsg, success: false})
				}

				const filename = `video_${analise._id}${path.extname(oldpath)}`
				saveFile(files.file, analise)
			})
		})

		function saveFile(file, analise) {
			let oldpath = file.path
			let filename = `video_${analise._id}${path.extname(oldpath)}`
			let targetpath = analiseHelper.getAnaliseLocation(analise)

			if (!fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath, {recursive: true})
			}

			targetpath += filename

			fileHelper.renameFile(oldpath, targetpath)

			analise.video = targetpath
			analise.save()

			return res.status(201).json({
				message: "Vídeo enviado com sucesso!",
				success: true,
			})
		}
	},

	extractFrames: async (req, res, next) => {
		const analiseId = req.params.id
		const quadrantes = req.body.quadrantes
		const fps = req.body.fps || 1
		let analise = null

		try {
			analise = await analiseModel.findById(analiseId)
			analise.fps = fps
		} catch (err) {
			return res.status(422).send(err.errors)
		}

		if (!analise || !analise.video) {
			return res.status(404).json({
				message: "A análise informada não possui vídeo",
				error: err,
				success: false,
			})
		}

		const videopath = analise.video
		const count = 1 / fps
		const path =
			analise.video.substring(0, analise.video.lastIndexOf("/")) + "/"

		Object.keys(quadrantes).forEach(async (q, qindex) => {
			const quadrante = quadrantes[q]
			const initTime = timeHelper.timeToSeconds(quadrante[0])
			const endTime = timeHelper.timeToSeconds(quadrante[1])
			const offsets = timeHelper.offsets(initTime, endTime, count)
			const quadranteNumber = qindex + 1

			ffmpeg.ffprobe(videopath, function (err, metadata) {
				const meta = metadata.streams[0]
				let ratio = meta.display_aspect_ratio.split(":")
				ratio = ratio[0] / ratio[1]
				const width = Math.round(meta.height * ratio)
				const height = meta.height

				ffmpeg(videopath)
					.on("end", function () {
						offsets.forEach((sec, oindex) => {
							const miliseconds = Math.floor(sec * 1000)
							const generatedpath = `${path}Q${quadranteNumber}_${sec}.png`
							const targetpath = `${path}Q${quadranteNumber}_${miliseconds}.png`

							fs.rename(
								generatedpath,
								targetpath,
								(rename_error) => {
									if (rename_error) {
										console.log("ERROR: " + rename_error)
									}
								}
							)

							/* removes vídeo after last extraction */
							// if (oindex == offsets.length - 1) {
							// 	removeFile(videopath)
							// 	analise.video = ""
							// 	analise.save()
							// }
						})
					})
					.screenshots({
						timemarks: offsets,
						filename: `Q${quadranteNumber}_%s.png`,
						folder: path,
						size: width + "x" + height,
					})
			})

			offsets.forEach((sec) => {
				const miliseconds = Math.floor(sec * 1000)
				const targetpath = `${path}Q${quadranteNumber}_${miliseconds}.png`

				const frame = new frameModel({
					tempoMilis: Math.floor(miliseconds),
					url: targetpath,
					analiseId: analiseId,
					quadrante: quadranteNumber,
				})

				frame.save((frame_error, frame) => {
					if (frame_error) {
						console.log(frame_error)
					}
				})
			})
		})

		return res.status(201).json({
			message: "Extração de frames inicializada",
			success: true,
		})
	},

	videoStream: (req, res, next) => {
		const analiseId = req.params.id

		analiseModel
			.findById(analiseId)
			.then((analise) => {
				const path = analise.video
				if (path) {
					const stat = fs.statSync(path)
					const fileSize = stat.size
					const range = req.headers.range

					if (range) {
						const parts = range.replace(/bytes=/, "").split("-")
						const start = parseInt(parts[0], 10)
						const end = parts[1]
							? parseInt(parts[1], 10)
							: fileSize - 1
						const chunksize = end - start + 1
						const file = fs.createReadStream(path, {start, end})
						const head = {
							"Content-Range": `bytes ${start}-${end}/${fileSize}`,
							"Accept-Ranges": "bytes",
							"Content-Length": chunksize,
							"Content-Type": "video/mp4",
						}
						res.writeHead(206, head)
						file.pipe(res)
					} else {
						const head = {
							"Content-Length": fileSize,
							"Content-Type": "video/mp4",
						}
						res.writeHead(200, head)
						fs.createReadStream(path).pipe(res)
					}
				} else {
					return res.status(404).json({
						message: "A análise informada não possui vídeo",
						error: err,
						success: false,
					})
				}
			})
			.catch((err) => {
				res.status(422).json({
					message: "Erro no streaming do vídeo",
					error: err,
					success: false,
				})
			})
	},

	startMotilityProcessor: async (req, res, next) => {
		const analise = await analiseModel.findById(req.params.id)
		await analiseHelper.generateFilelists(analise)
		await analiseHelper.generatePrevnexts(analise)
		analiseHelper.startMotilityProcessors(analise)
		return res.status(201).json("1")
	},

	downloadMotilityResults: async (req, res, next) => {
		const analiseId = req.params.id
		const analise = await analiseModel.findById(analiseId)

		if (await analiseHelper.isMotilityProcessorFinished(analise)) {
			await analiseHelper.mergeMotilityFiles(analise)
			await analiseHelper.mergeMetadataToResults(analise, (files) => {
				const zipFile = `${analise.experimentoCodigo}_${analise.placa}_${analise.tempo}_motility_results.zip`
				const zipLocation = analiseHelper.getAnaliseLocation(analise) + zipFile
				let archive = fileHelper.zipArchives(files, zipLocation)
				res.attachment(zipLocation)
				archive.pipe(res)
			})
		}
	},
}
module.exports = analiseController
