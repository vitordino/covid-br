const paths = [
	'./copyStatesMeta',
	'./getCountryData',
	'./downloadTopo',
	'./getStatesData',
]

const main = async () => {
	for (let i = 0; i < paths.length; ) {
		const x = await import(paths[i])
		await x.default()
		i++
	}
}

main()

export default main
