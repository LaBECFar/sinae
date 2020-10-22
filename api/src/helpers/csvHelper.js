const {Parser} = require("json2csv")
const fileHelper = require("./fileHelper")
const fs = require("fs")
const csv = require("fast-csv")

const csvHelper = {
	writeToPath: (path, data, overwrite = true) => {
		if (overwrite && fs.existsSync(path)) {
			fs.unlinkSync(path)
		}

		return new Promise((resolve) => {
			csv.writeToPath(path, data, {headers: true})
				.on("error", (err) => console.error(err))
				.on("finish", () => resolve())
		})
	},

	readContent: (file) => {
		return new Promise((resolve) => {
			const dataArray = []

			csv.parseFile(file, {headers: true})
				.on("data", function (data) {
					dataArray.push(data)
				})
				.on("end", function () {
					resolve(dataArray)
				})
		}).catch((e) => {
			console.log(e)
		})
	},

	mergeFiles: async (files, outputFilePath) => {
		if (fs.existsSync(outputFilePath)) {
			fs.unlinkSync(outputFilePath)
		}

		const promises = files.map((path) => {
			return csvHelper.readContent(path)
		})

		const results = await Promise.all(promises)

		return new Promise((resolve) => {
			const csvStream = csv.format({headers: true})
			const writableStream = fs.createWriteStream(outputFilePath)

			writableStream.on("finish", function () {
				resolve()
			})

			csvStream.pipe(writableStream)

			results.forEach((result) => {
				result.forEach((data) => {
					csvStream.write(data)
				})
			})
			csvStream.end()
		}).catch((e) => {
			console.log(e)
		})
	},
}

module.exports = csvHelper
