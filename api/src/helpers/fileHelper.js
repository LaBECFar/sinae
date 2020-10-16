const fs = require("fs")
const path = require("path")
const archiver = require("archiver")

const fileHelper = {
	zipArchives: (files, zipLocation) => {
		if (fs.existsSync(zipLocation)) {
			fs.unlinkSync(zipLocation)
		}

		let output = fs.createWriteStream(zipLocation)

		let archive = archiver("zip", {
			gzip: true,
			zlib: {level: 9}, // compression level.
		})

		archive.on("error", (err) => {
			console.log("Erro ao criar zip")
			throw err
		})

		archive.pipe(output)

		files.forEach((file) => {
			if (fs.existsSync(file)) {
				const filename = file.split("/").pop()
				archive.file(file, {name: filename})
			}
		})

		archive.finalize()
		return archive
	},

	removeFile: (file) => {
		if (fs.existsSync(file)) {
			rmdir(file, function (removedir_error) {
				if (removedir_error) console.log(removedir_error)
			})
		}
	},

	saveFile: (file, content) => {
		const dir = path.dirname(file)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, {recursive: true}) // create directory if it doesn't exists
		}
		fs.writeFileSync(file, content)
	},

	renameFile: (oldname, newname) => {
		const dir = path.dirname(newname)
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, {recursive: true}) // create directory if it doesn't exists
		}
		fs.renameSync(oldname, newname); 
	}
}

module.exports = fileHelper
