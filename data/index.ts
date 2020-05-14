const getCountryData = require('./getCountryData')
const getStatesData = require('./getStatesData')

const main = () => {
	getCountryData()
	getStatesData()
}

main()

module.exports = main
