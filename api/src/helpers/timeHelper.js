const timeHelper = {
	timeToSeconds: (time) => {
		let value = time.split(":")
		let minToMilis = parseInt(value[0]) * 60 // minutes > seconds
		let secToMilis = parseInt(value[1]) // seconds
		return minToMilis + secToMilis
    },

    timeToMiliseconds(time) {
        return this.timeToSeconds(time) * 1000
    },
    
    offsets: (init, end, count) => {
        let offsets = []
        for (let i = init; i <= end; i += count) {
            offsets.push(i)
        }
        return offsets
    }
}

module.exports = timeHelper
