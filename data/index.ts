import copyStatesMeta from './copyStatesMeta'
import getCountryData from './getCountryData'
import downloadTopo from './downloadTopo'
import getStatesData from './getStatesData'

const main = () => {
	Promise.all([copyStatesMeta()]).finally(() =>
		Promise.all([getCountryData()]).finally(() =>
			Promise.all([downloadTopo()]).finally(() =>
				Promise.all([getStatesData()]),
			),
		),
	)
}

main()

export default main
