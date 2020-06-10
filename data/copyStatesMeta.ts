import { copyFile } from 'fs'

const input = `${__dirname}/statesMeta.json`
const output = `${__dirname}/../src/data/statesMeta.json`

const callback = (err: any) => {
	if (err) return console.error('error copying statesMeta.json')
	return console.log('statesMeta.json was copied')
}

export default () => copyFile(input, output, callback)
