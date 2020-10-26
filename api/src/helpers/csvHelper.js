const fs = require("fs")
const csv = require("fast-csv")

const csvHelper = {
	writeToPath: (path, data, overwrite = true) => {
		if (overwrite && fs.existsSync(path)) {
			fs.unlinkSync(path)
		}

		return new Promise((resolve) => {
			const stream = csv
				.writeToPath(path, data, {headers: true})
				.on("error", (err) => console.error(err))
				.on("finish", () => {
					stream.close()
					resolve(path)
				})
		})
	},

	readContent: (file) => {
		return new Promise((resolve) => {
			const dataArray = []

			const newHeaders = []

			csv.parseFile(file, {
				headers: (headers) => {
					if (newHeaders.length <= 0) {
						headers.forEach((column) => {
							if (!newHeaders.includes(column)) {
								newHeaders.push(column)
							} else {
								newHeaders.push(column + "_duplicate")
							}
						})
					}
					return newHeaders
				},
			})
				.on("error", (err) => console.error(err))
				.on("data", (data) => dataArray.push(data))
				.on("end", () => resolve(dataArray))
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
			writableStream.on("end", () => writableStream.close())
			writableStream.on("close", () => resolve())

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
