const fs = require("fs")
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

        files.forEach(file => {
            if (fs.existsSync(file)) {
                const filename = file.split('/').pop()
                archive.file(file, {name: filename})
            }
        });

        archive.finalize()
        return archive
    }

}

module.exports = fileHelper