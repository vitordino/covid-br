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
	nc: number
	tc: number
}

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

type Main = {
	[key: string]: StateOutput[]
}

type StringPropertiesOf<T> = Pick<
	T,
	{
		[K in keyof T]: T[K] extends number ? K : never
	}[keyof T]
>

const defaultFilter = (x: StateOutput) => !!x

const higher = (a: number, b: number) => (a > b ? a : b)

const getHighest = (prop: keyof StringPropertiesOf<StateOutput>) => (
	filter = defaultFilter,
) => (x: StateOutput[]) =>
	Object.values(x)
		.filter(filter)
		.map((x) => x[prop])
		.reduce(higher, 0)

const getHighestStateCase = getHighest('tc')((x) => x.st !== 'TOTAL')
const getHighestTotalCase = getHighest('tc')((x) => x.st === 'TOTAL')
const getHighestStateDeath = getHighest('td')((x) => x.st !== 'TOTAL')
const getHighestTotalDeath = getHighest('td')((x) => x.st === 'TOTAL')

const processLines = (input: StateEntries) => {
	const renamedData = renameData(input)
	const main: Main = groupByDate(renamedData)
	const dates = renamedData.map(getDates)
	const states = renamedData.map(getStates)
	const highestStateCase = getHighestStateCase(renamedData)
	const highestTotalCase = getHighestTotalCase(renamedData)
	const highestStateDeath = getHighestStateDeath(renamedData)
	const highestTotalDeath = getHighestTotalDeath(renamedData)
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
