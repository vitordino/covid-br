import { writeFile } from 'fs'
import { get } from 'https'
import { parse } from '@fast-csv/parse'
import { main, dates } from './country.json'
import { ErrorType } from './getCountryData'

const selectKeys = (keys: string[]) => (obj: Record<string, any>) =>
	Object.entries(obj).reduce((acc, [k, v]) => {
		if (!keys.includes(k)) return acc
		return { ...acc, [k]: v }
	}, {})

const keysToMaintainFromMain = ['date', 'tc', 'nc', 'ptc', 'td', 'nd', 'ptd']

const clearMainKeys = selectKeys(keysToMaintainFromMain)

const getTotals = id =>
	Object.entries(main).reduce(
		(acc, [k, v]) => ({
			...acc,
			[k]: v.filter(({ st }) => st === id).map(clearMainKeys)[0],
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
	date: string
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
	date,
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
	date,
	ct: city.split('/')[0],
	id: parseInt(ibgeID),
	tc: parseInt(totalCases),
	nc: parseInt(newCases),
	td: parseInt(deaths),
	nd: parseInt(newDeaths),
	ptd: +(parseFloat(deaths_per_100k_inhabitants) / 100000).toFixed(6),
	ptc: +(parseFloat(totalCases_per_100k_inhabitants) / 100000).toFixed(6),
	dbc: +parseFloat(deaths_by_totalCases).toFixed(6),
})

const pushLineToStateDate = (state: StateKeys, date: string) => (
	line: Record<string, any>,
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

export default () =>
	get(url, (res: any) =>
		res
			.pipe(parse({ headers: true }))
			.on('error', handleError)
			.on('data', handleData)
			.on('end', handleEnd),
	)
