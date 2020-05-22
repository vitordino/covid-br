// @ts-nocheck
const { get } = require('https')
const { writeFile } = require('fs')
const { parse } = require('@fast-csv/parse')

const { main, dates } = require('./country.json')

const selectKeys = (keys: string[]) => (obj: Record<string, any>) =>
	Object.entries(obj).reduce((acc, [k, v]) => {
		if (!keys.includes(k)) return acc
		return { ...acc, [k]: v }
	}, {})

const keysToMaintainFromMain = ['tc', 'nc', 'ptc', 'td', 'nd', 'ptd']

const clearMainKeys = selectKeys(keysToMaintainFromMain)

const getTotals = id =>
	Object.entries(main).reduce(
		(acc, [k, v]) => ({
			...acc,
			[k]: clearMainKeys(v.find(({ st }) => st === id)),
		}),
		{},
	)

// prettier-ignore
enum StatesEnum { SP,	MG,	RJ,	BA,	PR,	RS,	PE,	CE,	PA,	SC,	MA,	GO,	AM,	ES,	PB,	RN,	MT,	AL,	PI,	DF,	MS,	SE,	RO,	TO,	AC,	AP,	RR }

type StateKeys = keyof typeof StatesEnum

type StateMapOf<T> = {
	[K in StateKeys]: T
}

type CityEntry = {
	state: StateKeys
	date: string
	country: 'Brazil'
	city: string
	ibgeID: string
	newDeaths: string
	deaths: string
	newCases: string
	totalCases: string
	deaths_per_100k_inhabitants: string
	totalCases_per_100k_inhabitants: string
	deaths_by_totalCases: string
}

type CityOutput = {
	ct: string
	id: number
	tc: number
	nc: number
	td: number
	nd: number
	ptd: number
	ptc: number
	dbc: number
}

const noop = () => ({})

const url =
	'https://cdn.jsdelivr.net/gh/wcota/covid19br@master/cases-brazil-cities-time.csv'

type Outputs = StateMapOf<Record<string, CityOutput[] | undefined>>

// prettier-ignore
const outputs: Outputs = { SP: {}, MG: {}, RJ: {}, BA: {}, PR: {}, RS: {}, PE: {}, CE: {}, PA: {}, SC: {}, MA: {}, GO: {}, AM: {}, ES: {}, PB: {}, RN: {}, MT: {}, AL: {}, PI: {}, DF: {}, MS: {}, SE: {}, RO: {}, TO: {}, AC: {}, AP: {}, RR: {} }

const write = (
	destinies: Array<string> = [],
	content: any,
	handle: Function,
) => {
	const json = JSON.stringify(content)
	destinies.forEach((d, i) =>
		writeFile(d, json, (x: ErrorType) => handle(x, d, i)),
	)
}

const renameLineData = ({
	city,
	ibgeID,
	newDeaths,
	deaths,
	newCases,
	totalCases,
	deaths_per_100k_inhabitants,
	totalCases_per_100k_inhabitants,
	deaths_by_totalCases,
}: CityEntry) => ({
	ct: city.split('/')[0],
	id: parseInt(ibgeID),
	tc: parseInt(totalCases),
	nc: parseInt(newCases),
	td: parseInt(deaths),
	nd: parseInt(newDeaths),
	ptd: +(10 * parseFloat(deaths_per_100k_inhabitants)).toFixed(6),
	ptc: +(10 * parseFloat(totalCases_per_100k_inhabitants)).toFixed(6),
	dbc: +parseFloat(deaths_by_totalCases).toFixed(6),
})

const pushLineToStateDate = (state: StateKeys, date: string) => (
	line: object,
) => {
	if (!(state in outputs)) outputs[state] = {}
	if (!(date in outputs[state])) outputs[state][date] = []
	outputs[state][date].push(line)
}

const handleError = (err: string) => {
	throw new Error(err)
}

const handleData = ({ state, date, ...line }: CityEntry) => {
	pushLineToStateDate(state, date)(renameLineData({ state, date, ...line }))
}

const getDestiny = (x: string) =>
	`${__dirname}/../public/data/${x.toLowerCase()}.json`

const handleEnd = (rowCount: number) => {
	console.log(`Parsed ${rowCount} rows`)
	Object.entries(outputs).forEach(([k, v]) =>
		write([getDestiny(k)], { main: v, totals: getTotals(k), dates }, noop),
	)
}

module.exports = () =>
	get(url, (res: any) =>
		res
			.pipe(parse({ headers: true }))
			.on('error', handleError)
			.on('data', handleData)
			.on('end', handleEnd),
	)
