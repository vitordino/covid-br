const main = () => {
	Promise.all([
		require('./copyStatesMeta')(),
		require('./getCountryData')(),
	]).then(() => {
		Promise.all([
			require('./getStatesData')(),
			require('./downloadTopo')(),
		])
	})
}

main()

module.exports = main
