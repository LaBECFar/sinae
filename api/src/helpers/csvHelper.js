const {Parser} = require("json2csv")
const csv = require("csv-parser")
const fs = require("fs")

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
		fs.writeFileSync(file, result)
	},
}

module.exports = csvHelper
