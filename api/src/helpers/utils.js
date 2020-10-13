const utils = {
	sortByAttr: (array, attr) => {
		return array.sort((a, b) => {
			if (a[attr] < b[attr]) {
				return -1
			}
			if (a[attr] > b[attr]) {
				return 1
			}
			return 0
		})
	},
}

module.exports = utils
