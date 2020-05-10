// @ts-nocheck
const { get } = require('https')
const { writeFile } = require('fs')
const { parse } = require('@fast-csv/parse')
const { groupBy, uniq, values } = require('ramda')

const url =
	'https://cdn.jsdelivr.net/gh/wcota/covid19br@master/cases-brazil-cities-time.csv'

const outputs = {}

const statesMeta = require('./statesMeta.json')

const stateKeys = Object.keys(statesMeta)

const noop = () => ({})

const getDestinies = (state: keyof typeof StatesEnum) => {
	return [
		`${__dirname}/../../public/data/${state.toLowerCase()}.json`,
		`${__dirname}/../../src/data/${state.toLowerCase()}.json`,
	]
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

const pushLineToStateDate = (state: keyof typeof StatesEnum, date: string) => (
	line: StateEntry,
) => {
	if (!(state in outputs)) outputs[state] = {}
	if (!(date in outputs[state])) outputs[state][date] = []
	outputs[state][date].push(line)
}

const handleError = (err: string) => {
	throw new Error(err)
}

const handleData = ({ state, date, ...line }: StateEntry) => {
	pushLineToStateDate(state, date)(line)
}

const getDestiny = x => `${__dirname}/../../public/data/${x.toLowerCase()}.json`

const handleEnd = (rowCount: number) => {
	console.log(`Parsed ${rowCount} rows`)
	Object.entries(outputs).forEach(([k, v]) => write([getDestiny(k)], v, noop))
}

module.exports = () =>
	get(url, (res: any) =>
		res
			.pipe(parse({ headers: true }))
			.on('error', handleError)
			.on('data', handleData)
			.on('end', handleEnd),
	)
