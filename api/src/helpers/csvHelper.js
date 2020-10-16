const {Parser} = require("json2csv")
const fileHelper = require("./fileHelper")

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
}

module.exports = csvHelper
