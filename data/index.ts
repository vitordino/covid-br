const main = async () => {
	await Promise.all([ 
		require('./copyStatesMeta')(),
		require('./getCountryData')(),
		require('./getStatesData')(),
		require('./downloadTopo')(),
	])
}

main()

module.exports = main
