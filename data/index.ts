const wait = require('waait')

const main = async () => {
	await Promise.all([
		require('./copyStatesMeta')(),
		require('./getCountryData')(),
		await wait(1),
		require('./downloadTopo')(),
		require('./getStatesData')(),
	])
}

main()

module.exports = main
