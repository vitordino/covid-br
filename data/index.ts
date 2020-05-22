const main = () => {
	Promise.all([require('./copyStatesMeta')()]).finally(() =>
		Promise.all([require('./getCountryData')()]).finally(() =>
			Promise.all([require('./downloadTopo')()]).finally(() =>
				Promise.all([require('./getStatesData')()]),
			),
		),
	)
}

main()

module.exports = main
