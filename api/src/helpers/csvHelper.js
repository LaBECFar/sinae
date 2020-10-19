const {Parser} = require("json2csv")
const fileHelper = require("./fileHelper")
const fs = require("fs")
const csv = require("csv-parser")
const {resolve} = require("path")

const csvHelper = {
	dataToCsv: (file, data, fields) => {
		let parserOptions = {
			quote: "",
			delimiter: ",",
		}

		if (fields) {
			parserOptions.fields = fields
		}

		const json2csvParser = new Parser(parserOptions)
		const result = json2csvParser.parse(data)
		fileHelper.saveFile(file, result)
	},

	readContent: async (file) => {
		return new Promise((resolve) => {
			let result = []
			fs.createReadStream(file)
				.pipe(csv())
				.on("data", function (data) {
					result.push(data)
				})
				.on("end", function () {
					resolve(result)
				})
		}).catch((e) => {
			console.log(e)
		})
	},

	readMultipleFiles: async (files) => {
		let result = []

		const promises = files.map(async (url) => {
			const content = await csvHelper.readContent(url)
			result.push(content)
		})

		await Promise.all(promises);
		return result
	},

	mergeFiles: async (mergedFile, files) => {
		const content = await csvHelper.readMultipleFiles(files)
		//const fields = Object.keys(content[0])
		console.log(content.length)
		//csvHelper.dataToCsv(mergedFile, content, fields)
	},
}

module.exports = csvHelper
