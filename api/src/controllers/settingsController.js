const path = require("path")
const fs = require("fs")
const settingsPath = path.resolve(__dirname, "../../config/settings.json")

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
		
		return res.status(201).json({ ...settings, saved: true })
	},
}

module.exports = settingsController
