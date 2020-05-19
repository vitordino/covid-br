const getCountryData = require('./getCountryData')
const getStatesData = require('./getStatesData')
const copyStatesMeta = require('./copyStatesMeta')
const downloadTopo = require('./downloadTopo')

const main = async () => {
	await getCountryData()
	getStatesData()
	downloadTopo()
}

main()

module.exports = main
