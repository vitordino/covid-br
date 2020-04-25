const { get } = require('https')
const { writeFile } = require('fs')
const { parse } = require('@fast-csv/parse')
const { groupBy, uniq, values } = require('ramda')

const states: StatesMeta = require('./statesMeta.json')
const totalPopulation = Object.values(states).reduce((a, { p }) => a + p, 0)

type ErrorType = Error | String

type StateEntry = {
	date: string
	state: string
	deaths: string
	newDeaths: string
	newCases: string
	totalCases: string
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
}

type PopulationalEnhancedOutput = {
	date: string
	st: string
	td: number
	nd: number
	ptd?: number
	tc: number
	nc: number
	ptc?: number
}

type EnhancedOutput = {
	date: string
	st: string
	td: number
	nd: number
	rtd?: number
	ptd?: number
	tc: number
	nc: number
	rtc?: number
	ptc?: number
}

type Outputs = StateOutput[]
type EnhancedOutputs = EnhancedOutput[]

type Grouped = {
	[key: string]: PopulationalEnhancedOutput[]
}

type GroupedEnhanced = {
	[key: string]: EnhancedOutputs
}

type TypePropertiesOf<T1, T2> = Pick<
	T1,
	{ [K in keyof T1]: T1[K] extends T2 ? K : never }[keyof T1]
>

type NumericKeysOf<T> = keyof TypePropertiesOf<T, number>

type NumericKey = NumericKeysOf<StateOutput>

type StateMeta = { p: number; n: string }
type StatesMeta = {
	[key: string]: StateMeta
}

type StateKeys = keyof typeof StatesEnum

const lines: StateEntries = []

const destinies = [
	`${__dirname}/../public/data/states.json`,
	`${__dirname}/../src/data/states.json`,
]

const url =
	'https://cdn.jsdelivr.net/gh/wcota/covid19br@master/cases-brazil-states.csv'

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

const handleData = (data: StateEntry) => lines.push(data)

const handleWrite = (err: ErrorType, destiny: string) => {
	if (err) {
		console.error(destiny)
		console.error(err)
		return
	}
	return console.log(`file ${destiny} was saved`)
}

const renameData = (data: StateEntries) =>
	data.map(({ date, state, deaths, newDeaths, newCases, totalCases }) => ({
		date,
		st: state,
		td: parseInt(deaths),
		nd: parseInt(newDeaths),
		nc: parseInt(newCases),
		tc: parseInt(totalCases),
	}))

type GetStateFn = ({ st }: StateOutput) => StateKeys | string
const getState: GetStateFn = ({ st }) => st
const getDate = ({ date }: StateOutput) => date
const groupByDate = groupBy(getDate)

const higher = (a: number, b: number) => (a > b ? a : b)

type FilterOf<T> = (x: T) => boolean

const defaultFilter: FilterOf<any> = x => !!x

const getHighest = <T extends StateOutput>(prop: NumericKeysOf<T>) => (
	filter: (value: T) => boolean = defaultFilter,
) => (x: T[]) =>
	values(x)
		.filter(filter)
		.map((x: T) => x[prop])
		.reduce(higher)

// i f***** hate TS
const getHighestPop = <T extends PopulationalEnhancedOutput>(prop: keyof T) => (
	filter: (value: T) => boolean = defaultFilter,
) => (x: T[]) =>
	values(x)
		.filter(filter)
		.map((x: T) => x[prop])
		.reduce(higher)

const getHighestStateCase = getHighest('tc')(({ st }) => st !== 'TOTAL')
const getHighestTotalCase = getHighest('tc')(({ st }) => st === 'TOTAL')
const getHighestPopCase = getHighestPop('ptc')(({ st }) => st !== 'TOTAL')
const getHighestStateDeath = getHighest('td')(({ st }) => st !== 'TOTAL')
const getHighestTotalDeath = getHighest('td')(({ st }) => st === 'TOTAL')
const getHighestPopDeath = getHighestPop('ptd')(({ st }) => st !== 'TOTAL')

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

const toEnhance: NumericKey[] = ['tc', 'td']

const processLines = (input: StateEntries) => {
	const renamed: Outputs = renameData(input)
	const dates = uniq(renamed.map(getDate))
	const highestStateCase = getHighestStateCase(renamed)
	const highestTotalCase = getHighestTotalCase(renamed)
	const highestStateDeath = getHighestStateDeath(renamed)
	const highestTotalDeath = getHighestTotalDeath(renamed)
	const withPopulationalData = enhanceWithPopulationalData(toEnhance)(renamed)
	const highestPopCase = getHighestPopCase(withPopulationalData)
	const highestPopDeath = getHighestPopDeath(withPopulationalData)
	const grouped: Grouped = groupByDate(withPopulationalData)
	const main: GroupedEnhanced = enhanceData(toEnhance)(grouped)
	return {
		main,
		dates,
		states,
		highestStateCase,
		highestTotalCase,
		highestStateDeath,
		highestTotalDeath,
		highestPopCase,
		highestPopDeath,
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
