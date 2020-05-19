// @ts-nocheck
const fetch = require('isomorphic-fetch')
const { writeFile } = require('fs')

const fetchJSON = (url: string) => fetch(url).then(r => r.json())

const countryUrl =
	'https://gist.githubusercontent.com/ruliana/1ccaaab05ea113b0dff3b22be3b4d637/raw/196c0332d38cb935cfca227d28f7cecfa70b412e/br-states.json'

const statesUrl = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

const getUrlbyId = id =>
	`https://servicodados.ibge.gov.br/api/v2/malhas/${id}?resolucao=5&formato=application/json`

const getDestiny = (x: string) =>
	`${__dirname}/../public/topo/${x.toLowerCase()}.json`

const handleError = error => {
	if (!error) return
	throw new Error(error)
}

const downloadCountry = async () => {
	const data = await fetchJSON(countryUrl)
	const destiny = getDestiny('country')
	const json = JSON.stringify(data)
	return writeFile(destiny, json, handleError)
}

const downloadStates = async () => {
	const states = await fetchJSON(statesUrl)
	states.forEach(async ({ id, sigla }) => {
		const data = await fetchJSON(getUrlbyId(id))
		const destiny = getDestiny(sigla)
		const json = JSON.stringify(data)
		return writeFile(destiny, json, handleError)
	})
}

module.exports = async () => {
	await downloadCountry()
	await downloadStates()
}
