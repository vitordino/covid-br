const { get } = require('https')
const { writeFile } = require('fs')
const { parse } = require('@fast-csv/parse')
const { groupBy, uniq, values } = require('ramda')

const states: StatesMeta = require('./statesMeta.json')
const totalPopulation = Object.values(states).reduce((a, { p }) => a + p, 0)

type HashMapOf<T> = { [key: string]: T }

type ErrorType = Error | String

type StateEntry = {
	date: string
	state: string
	deaths: string
	newDeaths: string
	newCases: string
	totalCases: string
	recovered: string
	newRecovered?: string
}

// prettier-ignore
enum StatesEnum { SP, MG, RJ, BA, PR, RS, PE, CE, PA, SC, MA, GO, AM, ES, PB, RN, MT, AL, PI, DF, MS, SE, RO, TO, AC, AP, RR }

type StateEntries = StateEntry[]

type StateOutput = {
	date: string
	st: string
	td: number
	nd: number
	tc: number
	nc: number
	tr: number
	nr: number
}

type PopulationalEnhancedOutput = {
	date: string
	st: string
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
	st: string
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
type StatesMeta = HashMapOf<StateMeta>

type StateKeys = keyof typeof StatesEnum

type PickFirst<T extends {}> = (x: HashMapOf<T[]>) => HashMapOf<T>

const pickFirst: PickFirst<EnhancedOutput> = x =>
	Object.entries(x).reduce((acc, [k, v]) => ({ ...acc, [k]: v[0] }), {})

const lines: StateEntries = []

const destinies = [
	`${__dirname}/../public/data/states.json`,
	`${__dirname}/../src/data/states.json`,
]

const url =
	'https://cdn.jsdelivr.net/gh/wcota/covid19br@master/cases-brazil-states.csv'

const getNewRecovered = ({ state, recovered }: StateEntry) => {
	const stateLines = lines.filter(x => x.state === state)
	const stateRecovered = stateLines.map(x => x.recovered)
	const lastRecovered = stateRecovered[stateRecovered.length - 1]
	return (parseInt(recovered) - parseInt(lastRecovered)).toString()
}

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

const handleError = (err: string) => {
	throw new Error(err)
}

const handleData = (data: StateEntry) => {
	lines.push({ ...data, newRecovered: getNewRecovered(data) })
}

const handleWrite = (err: ErrorType, destiny: string) => {
	if (err) {
		console.error(destiny)
		console.error(err)
		return
	}
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

type GetStateFn = ({ st }: StateOutput) => StateKeys | string
const getState: GetStateFn = ({ st }) => st
const getDate = ({ date }: StateOutput) => date
const groupByDate = groupBy(getDate)

const higher = (a: number, b: number) => Math.max(a, b)

type FilterOf<T> = (x: T) => boolean

const defaultFilter: FilterOf<any> = x => !!x

const getHighest = <T extends StateOutput>(prop: NumericKeysOf<T>) => (
	filter: (value: T) => boolean = defaultFilter,
) => (x: T[]) =>
	values(x)
		.filter(filter)
		.filter((x: T) => !!x[prop])
		.map((x: T) => x[prop])
		.reduce(higher, 0)

// i f***** hate TS
const getHighestPop = <T extends PopulationalEnhancedOutput>(prop: keyof T) => (
	filter: (value: T) => boolean = defaultFilter,
) => (x: T[]) =>
	values(x)
		.filter(filter)
		.filter((x: T) => !!x[prop])
		.map((x: T) => x[prop])
		.reduce(higher, 0)

const getHighestStateCase = getHighest('tc')(({ st }) => st !== 'TOTAL')
const getHighestStateNewCase = getHighest('nc')(({ st }) => st !== 'TOTAL')
const getHighestStateDeath = getHighest('td')(({ st }) => st !== 'TOTAL')
const getHighestStateNewDeath = getHighest('nd')(({ st }) => st !== 'TOTAL')
const getHighestStateRecovered = getHighest('tr')(({ st }) => st !== 'TOTAL')
const getHighestStateNewRecovered = getHighest('nr')(({ st }) => st !== 'TOTAL')

const getHighestTotalCase = getHighest('tc')(({ st }) => st === 'TOTAL')
const getHighestTotalNewCase = getHighest('nc')(({ st }) => st === 'TOTAL')
const getHighestTotalDeath = getHighest('td')(({ st }) => st === 'TOTAL')
const getHighestTotalNewDeath = getHighest('nd')(({ st }) => st === 'TOTAL')
const getHighestTotalRecovered = getHighest('tr')(({ st }) => st === 'TOTAL')
const getHighestTotalNewRecovered = getHighest('nr')(({ st }) => st === 'TOTAL')

const getHighestPopCase = getHighestPop('ptc')()
const getHighestPopNewCase = getHighestPop('pnc')()
const getHighestPopDeath = getHighestPop('ptd')()
const getHighestPopNewDeath = getHighestPop('pnd')()
const getHighestPopRecovered = getHighestPop('ptr')()
const getHighestPopNewRecovered = getHighestPop('pnr')()

type EnhanceReducerFn = (
	arr: Outputs,
) => (
	acc: PopulationalEnhancedOutput,
	k: NumericKey,
	i: number,
) => EnhancedOutput

const enhance: EnhanceReducerFn = arr => (acc, k, i) => ({
	...acc,
	[`r${k}`]: acc[k] / getHighest(k)(x => !!x)(arr),
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
		const population = states[state]?.p || totalPopulation
		return toEnhance.reduce(
			(acc, k) => ({ ...acc, [`p${k}`]: acc[k] / population }),
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
	const dates = uniq(renamed.map(getDate))
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

const handleEnd = (rowCount: number) => {
	console.log(`Parsed ${rowCount} rows`)
	write(destinies, processLines(lines), handleWrite)
}

module.exports = () =>
	get(url, (res: any) =>
		res
			.pipe(parse({ headers: true }))
			.on('error', handleError)
			.on('data', handleData)
			.on('end', handleEnd),
	)
