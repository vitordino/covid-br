const getCountryData = require('./getCountryData')
const getStatesData = require('./getStatesData')
const copyStatesMeta = require('./copyStatesMeta')

const main = () => {
	getCountryData()
	getStatesData()
	copyStatesMeta()
}

main()

module.exports = main
