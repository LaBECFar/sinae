const analiseModel = require("../models/analiseModel")
const frameModel = require("../models/frameModel")
const {Parser} = require("json2csv")
const fs = require("fs")
const utils = require("./utils")

const analiseHelper = {
	generateFilelist: async (analiseId) => {
		const list = await analiseHelper.getPocosFilelist(analiseId)
		const analise = await analiseModel.findById(analiseId)

		fs.writeFileSync(
			analiseHelper.getAnaliseLocation(analise) + "filelist.csv",
			list.join("\n")
		)
	},

	generatePrevNextList: async (analiseId) => {
		const analise = await analiseModel.findById(analiseId)
		const milisIncrement = Math.floor(1000 / analise.fps)

		const previousList = await analiseHelper.getPocosFilelist(analiseId)
		let list = []

		previousList.forEach((url, index) => {
			const milis = url.substring(
				url.lastIndexOf("/") + 5,
				url.lastIndexOf("_seg.")
			)
            const nextMilis = parseInt(milis) + milisIncrement

			const nextUrl = url.replace(
				"_" + milis + "_seg.",
				"_" + nextMilis + "_seg."
			)

			list.push({
				prev: url,
				next: nextUrl,
			})
		})

		const json2csvParser = new Parser({
			fields: [
				{label: "Previous", value: "prev"},
				{label: "Next", value: "next"},
			],
			quote: "",
			delimiter: ",",
		})

		const csv = json2csvParser.parse(list)

		fs.writeFileSync(
			analiseHelper.getAnaliseLocation(analise) + "prevnext.csv",
			csv
		)
    },
    
    getPrevNext: async () => {
        const frames = await frameModel.find( {analiseId}, ["pocos", "tempoMilis"], { sort: {tempoMilis: 1} })
        
        const pocos = []

        frames.forEach((frame, index) => {
            const nextFrame = frames[index+1]

            frame.pocos.forEach(poco => {
                const nextPoco = nextFrame
            })

        })

    },

	getAnaliseLocation: (analise) => {
		return `/usr/uploads/experimentos/${analise.experimentoCodigo}/${analise.placa}/${analise.tempo}/`
	},

	getPocosFilelist: async (analiseId) => {
		const frames = await frameModel.find(
			{analiseId},
			["pocos", "tempoMilis"],
			{
				sort: {tempoMilis: 1},
			}
		)

		let list = []

		frames.forEach((frame) => {
			frame.pocos.map((poco) =>
				list.push(`file://${poco.url.replace(".", "_seg.")}`)
			)
		})

		return list.sort()
	},

	isMotilityFinished: async (analiseId) => {
		const analise = analiseModel.findById(analiseId)
		const path = `/usr/uploads/experimentos/${analise.experimentoCodigo}/${analise.placa}/${analise.tempo}/`
		const files = [
			`${path}resultado_Image.csv`, 
			`${path}resultado_FilterObjects_Previous.csv`
		]

		let exists = true

		files.forEach(filepath => {
			if (!fs.existsSync(filepath)) {
				exists = false
			}
		})

		return exists
	}
}

module.exports = analiseHelper
