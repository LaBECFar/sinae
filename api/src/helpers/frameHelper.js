const frameModel = require("../models/frameModel")

const frameHelper = {

    getFrames: async (query, fields, sort = { tempoMilis: 1 } ) => {
        return await frameModel.find(query, fields, { sort })
    },

    getWellFilelist: (wellName, frames) => {
        const wells = frameHelper.getWellsWithName(wellName, frames)
		return wells.map(poco => `file://${poco.url.replace(".", "_seg.")}`)
    },
    
    getWellsWithName: (wellName, frames) => {
        let list = []
        frames.forEach((frame) => {
            const pocos = frame.pocos.filter(poco => poco.nome == wellName)
            list.push(...pocos)
        })
        return list
    },

    getWells: (frames) => {
        let all = []
        frames.forEach(frame => {
            const names = frame.pocos.map(poco => poco.nome)
            all.push(...names)
        })
        return Array.from(new Set(all)) // unique names only
    }
}

module.exports = frameHelper