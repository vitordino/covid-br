const https = require('https')
const fs = require('fs')
const { parse } = require('@fast-csv/parse')

const output: Array<Object> = []

const url =
	'https://cdn.jsdelivr.net/gh/wcota/covid19br@master/cases-brazil-total.csv'

const handleError = (err: string) => {
	throw new Error(err)
}

const handleData = (data: object) => output.push(data)

const handeWrite = (err: Error | String) => {
	if (err) return console.error(err)
	return console.log('file was saved')
}

const handleEnd = async (rowCount: number) => {
	console.log(`Parsed ${rowCount} rows`)
	fs.writeFile(
		`${__dirname}/../public/data/total.json`,
		JSON.stringify(output),
		handeWrite,
	)
}

https.get(url, (res: any) => {
	res
		.pipe(parse({ headers: true }))
		.on('error', handleError)
		.on('data', handleData)
		.on('end', handleEnd)
})
