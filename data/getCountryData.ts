import { writeFile } from 'fs'
import { get } from 'https'
import { parse } from '@fast-csv/parse'
import { groupBy, uniq } from 'ramda'
import { getLatestDate } from './utils'

const states: StatesMeta = require('./statesMeta.json')
const totalPopulation = Object.values(states).reduce((a, { p }) => a + p, 0)

type HashMapOf<T> = Record<string, T>

export type ErrorType = Error | String

// prettier-ignore
enum StatesEnum { SP, MG, RJ, BA, PR, RS, PE, CE, PA, SC, MA, GO, AM, ES, PB, RN, MT, AL, PI, DF, MS, SE, RO, TO, AC, AP, RR }

type StateKeys = keyof typeof StatesEnum

type StateMapOf<T> = {
	[K in StateKeys]: T
}

type StateEntry = {
	date: string
	state: StateKeys | 'TOTAL'
	deaths: string
	newDeaths: string
	newCases: string
	totalCases: string
	recovered: string
	newRecovered?: string
}

type StateEntries = StateEntry[]

type StateOutput = {
	date: string
	st: StateKeys | 'TOTAL'
	td: number
	nd: number
	tc: number
	nc: number
	tr: number
	nr: number
}

type PopulationalEnhancedOutput = {
	date: string
	st: StateKeys | 'TOTAL'
	td: number
	nd: number
	ptd?: number
	pnd?: number
	tc: number
	nc: number
	ptc?: number
	pnc?: number
	tr: number
	nr: number
	ptr?: number
	pnr?: number
}

type EnhancedOutput = {
	date: string
	st: StateKeys | 'TOTAL'
	td: number
	nd: number
	rtd?: number
	ptd?: number
	pnd?: number
	tc: number
	nc: number
	rtc?: number
	ptc?: number
	pnc?: number
	tr: number
	nr: number
	rtr?: number
	ptr?: number
	pnr?: number
}

type Outputs = StateOutput[]
type EnhancedOutputs = EnhancedOutput[]

type Grouped = HashMapOf<PopulationalEnhancedOutput[]>

type GroupedEnhanced = HashMapOf<EnhancedOutputs>

type TypePropertiesOf<T1, T2> = Pick<
	T1,
	{ [K in keyof T1]: T1[K] extends T2 ? K : never }[keyof T1]
>

type NumericKeysOf<T> = keyof TypePropertiesOf<T, number>

type NumericKey = NumericKeysOf<StateOutput>

type StateMeta = { p: number; n: string }
type StatesMeta = StateMapOf<StateMeta>

type PickFirst<T extends {}> = (x: HashMapOf<T[]>) => HashMapOf<T>

const pickFirst: PickFirst<EnhancedOutput> = x =>
	Object.entries(x).reduce((acc, [k, v]) => ({ ...acc, [k]: v[0] }), {})

const lines: StateEntries = []

const destinies = [
	`${__dirname}/country.json`,
	`${__dirname}/../public/data/country.json`,
]

const numberDestinies = [
	`${__dirname}/../public/data/numbers.json`,
	`${__dirname}/../src/data/numbers.json`,
]

const latestDestinies = [`${__dirname}/../public/data/country-latest.json`]

const url =
	'https://raw.githubusercontent.com/wcota/covid19br/master/cases-brazil-states.csv'

const getNewRecovered = ({ state, recovered }: StateEntry) => {
	const stateLines = lines.filter(x => x.state === state)
	const stateRecovered = stateLines.map(x => x.recovered)
	const lastRecovered = stateRecovered[stateRecovered.length - 1]
	return (parseInt(recovered) - parseInt(lastRecovered)).toString()
}

const write = (
	destinies: Array<string> = [],
	content: any,
	handle: (x: boolean, directory: string, index: number) => void,
) => {
	const json = JSON.stringify(content)
	destinies.forEach((directory, index) =>
		writeFile(directory, json, x => handle(!!x, directory, index)),
	)
}

const handleError = (err: string) => {
	throw new Error(err)
}

const handleData = (data: StateEntry) => {
	lines.push({ ...data, newRecovered: getNewRecovered(data) })
}

const handleWrite = (err: boolean, destiny: string) => {
	if (err) return console.error(destiny)
	return console.log(`file ${destiny} was saved`)
}

const renameData = (data: StateEntries) =>
	data.map(
		({
			date,
			state,
			deaths,
			newDeaths,
			newCases,
			totalCases,
			recovered,
			newRecovered,
		}) => ({
			date,
			st: state,
			td: parseInt(deaths),
			nd: parseInt(newDeaths),
			nc: parseInt(newCases),
			tc: parseInt(totalCases),
			tr: parseInt(recovered),
			nr: parseInt(newRecovered || '0'),
		}),
	)

type GetStateFn = ({ st }: StateOutput) => StateKeys | 'TOTAL'
const getState: GetStateFn = ({ st }) => st
const getDate = ({ date }: StateOutput) => date
const groupByDate = groupBy(getDate)
const higher = (a: number, b: number) => Math.max(a, b)

type FilterOf<T> = (value: T, index: number, arr: T[]) => boolean

const defaultFilter: FilterOf<any> = x => !!x

type GetHighestType = {
	<T>(filter?: FilterOf<T>): (prop: keyof T) => (x: T[]) => number
}

const getHighest: GetHighestType = (filter = defaultFilter) => prop => x =>
	+Object.values(x)
		.filter(filter)
		.filter(x => isFinite(+x[prop]))
		.map(x => +x[prop])
		.reduce(higher, 0)
		.toFixed(6)

const getHighestState = getHighest<StateOutput>(({ st }) => st !== 'TOTAL')
const getHighestTotal = getHighest<StateOutput>(({ st }) => st === 'TOTAL')

const getHighestStateCase = getHighestState('tc')
const getHighestStateNewCase = getHighestState('nc')
const getHighestStateDeath = getHighestState('td')
const getHighestStateNewDeath = getHighestState('nd')
const getHighestStateRecovered = getHighestState('tr')
const getHighestStateNewRecovered = getHighestState('nr')

const getHighestTotalCase = getHighestTotal('tc')
const getHighestTotalNewCase = getHighestTotal('nc')
const getHighestTotalDeath = getHighestTotal('td')
const getHighestTotalNewDeath = getHighestTotal('nd')
const getHighestTotalRecovered = getHighestTotal('tr')
const getHighestTotalNewRecovered = getHighestTotal('nr')

const getHighestPopCase = getHighest<PopulationalEnhancedOutput>()('ptc')
const getHighestPopNewCase = getHighest<PopulationalEnhancedOutput>()('pnc')
const getHighestPopDeath = getHighest<PopulationalEnhancedOutput>()('ptd')
const getHighestPopNewDeath = getHighest<PopulationalEnhancedOutput>()('pnd')
const getHighestPopRecovered = getHighest<PopulationalEnhancedOutput>()('ptr')
const getHighestPopNewRecovered = getHighest<PopulationalEnhancedOutput>()(
	'pnr',
)

type EnhanceReducerFn = (
	arr: Outputs,
) => (
	acc: PopulationalEnhancedOutput,
	k: NumericKey,
	i: number,
) => EnhancedOutput

const enhance: EnhanceReducerFn = arr => (acc, k) => ({
	...acc,
	// @ts-ignore
	[`r${k}`]: +(acc[k] / getHighest()(k)(arr)).toFixed(6),
})

type EnhanceDataFunction = (
	toEnhance: NumericKey[],
) => (data: Grouped) => GroupedEnhanced

const enhanceData: EnhanceDataFunction = toEnhance => data =>
	Object.entries(data).reduce(
		(acc, [k, v]) => ({
			...acc,
			[k]: v.map(data => toEnhance.reduce(enhance(v), data)),
		}),
		{},
	)

type EnhanceWithPopulationalDataFn = (
	toEnhance: NumericKey[],
) => (data: Outputs) => PopulationalEnhancedOutput[]

const enhanceWithPopulationalData: EnhanceWithPopulationalDataFn = toEnhance => data =>
	data.map(x => {
		const state = getState(x)
		const population = state === 'TOTAL' ? totalPopulation : states?.[state]?.p
		return toEnhance.reduce(
			(acc, k) => ({ ...acc, [`p${k}`]: +(acc[k] / population).toFixed(6) }),
			x,
		)
	})

const toEnhance: NumericKey[] = ['tc', 'td', 'nc', 'nd', 'tr', 'nr']

const getTotals = (arr: PopulationalEnhancedOutput[]) =>
	arr.filter(({ st }) => st === 'TOTAL')

const getNonTotals = (arr: PopulationalEnhancedOutput[]) =>
	arr.filter(({ st }) => st !== 'TOTAL')

const processLines = (input: StateEntries) => {
	// arrays + hashmaps
	const renamed: Outputs = renameData(input)
	const dates: string[] = uniq(renamed.map(getDate))
	const withPopulationalTotals = getTotals(
		enhanceWithPopulationalData(toEnhance)(renamed),
	)
	const withPopulationalStates = getNonTotals(
		enhanceWithPopulationalData(toEnhance)(renamed),
	)

	const groupedTotals: Grouped = groupByDate(withPopulationalTotals)
	const totals: HashMapOf<EnhancedOutput> = pickFirst(
		enhanceData(toEnhance)(groupedTotals),
	)

	const groupedStates: Grouped = groupByDate(withPopulationalStates)
	const main: GroupedEnhanced = enhanceData(toEnhance)(groupedStates)

	// numbers
	const highestStateCase = getHighestStateCase(renamed)
	const highestStateNewCase = getHighestStateNewCase(renamed)
	const highestTotalCase = getHighestTotalCase(renamed)
	const highestTotalNewCase = getHighestTotalNewCase(renamed)
	const highestPopCase = getHighestPopCase(withPopulationalStates)
	const highestPopNewCase = getHighestPopNewCase(withPopulationalStates)
	const highestTotalPopCase = getHighestPopCase(withPopulationalTotals)
	const highestTotalPopNewCase = getHighestPopNewCase(withPopulationalTotals)

	const highestStateDeath = getHighestStateDeath(renamed)
	const highestStateNewDeath = getHighestStateNewDeath(renamed)
	const highestTotalDeath = getHighestTotalDeath(renamed)
	const highestTotalNewDeath = getHighestTotalNewDeath(renamed)
	const highestPopDeath = getHighestPopDeath(withPopulationalStates)
	const highestPopNewDeath = getHighestPopNewDeath(withPopulationalStates)
	const highestTotalPopDeath = getHighestPopDeath(withPopulationalTotals)
	const highestTotalPopNewDeath = getHighestPopNewDeath(withPopulationalTotals)

	const highestStateRecovered = getHighestStateRecovered(renamed)
	const highestStateNewRecovered = getHighestStateNewRecovered(renamed)
	const highestTotalRecovered = getHighestTotalRecovered(renamed)
	const highestTotalNewRecovered = getHighestTotalNewRecovered(renamed)
	const highestPopRecovered = getHighestPopRecovered(withPopulationalStates)
	const highestPopNewRecovered = getHighestPopNewRecovered(
		withPopulationalStates,
	)
	const highestTotalPopRecovered = getHighestPopRecovered(
		withPopulationalTotals,
	)
	const highestTotalPopNewRecovered = getHighestPopNewRecovered(
		withPopulationalTotals,
	)

	return {
		main,
		totals,
		dates,
		states,

		highestStateCase,
		highestStateNewCase,
		highestTotalCase,
		highestTotalNewCase,
		highestPopCase,
		highestPopNewCase,
		highestTotalPopCase,
		highestTotalPopNewCase,

		highestStateDeath,
		highestStateNewDeath,
		highestTotalDeath,
		highestTotalNewDeath,
		highestPopDeath,
		highestPopNewDeath,
		highestTotalPopDeath,
		highestTotalPopNewDeath,

		highestStateRecovered,
		highestStateNewRecovered,
		highestTotalRecovered,
		highestTotalNewRecovered,
		highestPopRecovered,
		highestPopNewRecovered,
		highestTotalPopRecovered,
		highestTotalPopNewRecovered,
	}
}

type OutputDataType = {
	main: Record<string, EnhancedOutputs>
	totals: Record<string, EnhancedOutput>
	dates: string[]
	states: StateMapOf<StateMeta>
}

const getLatestData = ({ main, totals, dates, states }: OutputDataType) => {
	const latestDate = getLatestDate(dates)
	return {
		main: { [latestDate]: main[latestDate] },
		totals: { [latestDate]: totals[latestDate] },
		dates,
		states,
	}
}

const handleEnd = (rowCount: number) => {
	console.log(`Parsed ${rowCount} rows`)
	const { main, totals, dates, states, ...rest } = processLines(lines)
	const latest = getLatestData({ dates, main, totals, states })
	write(destinies, { main, totals, dates, states }, handleWrite)
	write(numberDestinies, rest, handleWrite)
	write(latestDestinies, latest, handleWrite)
}

const exportedFunction = () =>
	get(url, (res: any) =>
		res
			.pipe(parse({ headers: true }))
			.on('error', handleError)
			.on('data', handleData)
			.on('end', handleEnd),
	)

export default exportedFunction
