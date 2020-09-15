const path = require("path")
const fs = require("fs")
const settingsPath = path.resolve(__dirname, "../../config/settings.json")
const formidable = require("formidable")

const settingsController = {
	get: (req, res, next) => {
		let settings = {}

		try {
			settings = fs.readFileSync(settingsPath, "UTF-8")
			settings = JSON.parse(settings)
		} catch (err) {
			console.log("There has been an error parsing your JSON.")
			console.log(err)
		}

		return res.status(201).json(settings)
	},

	put: (req, res, next) => {
		let settings = req.body

		try {
			let data = JSON.stringify(settings)

			fs.writeFileSync(settingsPath, data, function (err) {
				if (err) {
					console.log(
						"There has been an error saving your configuration data."
					)
					console.log(err.message)
					return
				}
				console.log("Configuration saved successfully.")
			})
		} catch (err) {
			console.log("There has been an error parsing your JSON.")
			console.log(err)
		}

		return res.status(201).json({...settings, saved: true})
	},

	uploadModel: (req, res, next) => {
		var form = new formidable.IncomingForm()
		form.keepExtensions = true
		form.uploadDir = "/usr/uploads/tmp/"

		form.parse(req, function (err, fields, files) {
			if (err) return res.status(422).send(err.errors)

			if (!files.file) {
				let errorMsg = "Arquivo do modelo não transferido"
				return res
					.status(500)
					.json({error: true, message: errorMsg, success: false})
			}

			saveModel(files.file)
		})

		function saveModel(file) {
			let filename = "modelo.pkl"
			let oldpath = file.path
			let targetpath = "/usr/uploads/model"

			if (!fs.existsSync(oldpath)) {
				console.log("settingsController.js: Não existe o oldpath")
			}

			if (!fs.existsSync(targetpath)) {
				fs.mkdirSync(targetpath, {recursive: true})
			}

			targetpath += "/" + filename

			fs.rename(oldpath, targetpath, (err) => {
				if (err) throw err
				console.log("Modelo atualizado: " + targetpath)
				return res
					.status(201)
					.json({
						message: "Modelo atualizado com sucesso!",
						success: true,
					})
			})
		}
	},
}

module.exports = settingsController
