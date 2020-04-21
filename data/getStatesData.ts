const { get } = require('https')
const { writeFile } = require('fs')
const { parse } = require('@fast-csv/parse')
const { groupBy } = require('ramda')

type ErrorType = Error | String

type StateEntry = {
	date: string
	state: string
	deaths: string
	newDeaths: string
	newCases: string
	totalCases: string
}

type StateEntries = StateEntry[]

type StateOutput = {
	date: string
	st: string
	td: number
	nd: number
	tc: number
	nc: number
}

type EnhancedOutput = {
	date: string
	st: string
	td: number
	nd: number
	rtd?: number
	tc: number
	nc: number
	rtc?: number
}

type Outputs = StateOutput[]
type EnhancedOutputs = EnhancedOutput[]

type Main = {
	[key: string]: Outputs | EnhancedOutputs
}

type TypePropertiesOf<T1, T2> = Pick<
	T1,
	{ [K in keyof T1]: T1[K] extends T2 ? K : never }[keyof T1]
>

type NumericPropertiesOfStateOutput = TypePropertiesOf<StateOutput, number>

type nums = keyof NumericPropertiesOfStateOutput

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

const getDates = ({ date }: StateOutput) => date
const getStates = ({ st }: StateOutput) => st
const groupByDate = groupBy(getDates)

const defaultFilter = (x: StateOutput) => !!x

const higher = (a: number, b: number) => (a > b ? a : b)

const getHighest = (prop: nums) => (filter = defaultFilter) => (x: Outputs) =>
	Object.values(x)
		.filter(filter)
		.map((x) => x[prop])
		.reduce(higher, 0)

const getHighestStateCase = getHighest('tc')((x) => x.st !== 'TOTAL')
const getHighestTotalCase = getHighest('tc')((x) => x.st === 'TOTAL')
const getHighestStateDeath = getHighest('td')((x) => x.st !== 'TOTAL')
const getHighestTotalDeath = getHighest('td')((x) => x.st === 'TOTAL')

type KeyNumTuple = [nums, number]
type KeyNumTuples = KeyNumTuple[]

type EnhanceFunction = (acc: StateOutput, [k, t]: KeyNumTuple) => EnhancedOutput

const enhance: EnhanceFunction = (acc, [k, t]) => ({
	...acc,
	[`r${k}`]: acc[k] / t,
})

type EnhanceDataFunction = (
	args: KeyNumTuples,
) => (x: Outputs) => EnhancedOutput[]

const enhanceData: EnhanceDataFunction = (args) => (x) =>
	x.map((y) => args.reduce(enhance, y))

const processLines = (input: StateEntries) => {
	const renamed: Outputs = renameData(input)
	const dates = renamed.map(getDates)
	const states = renamed.map(getStates)
	const highestStateCase = getHighestStateCase(renamed)
	const highestTotalCase = getHighestTotalCase(renamed)
	const highestStateDeath = getHighestStateDeath(renamed)
	const highestTotalDeath = getHighestTotalDeath(renamed)
	const toEnhance: KeyNumTuples = [
		['tc', highestTotalCase],
		['td', highestTotalDeath],
	]
	const enhanced = enhanceData(toEnhance)(renamed)
	const main: Main = groupByDate(enhanced)
	return {
		main,
		dates,
		states,
		highestStateCase,
		highestTotalCase,
		highestStateDeath,
		highestTotalDeath,
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
