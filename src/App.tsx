import React, { useState } from 'react'
import { groupBy } from 'ramda'

import data from './data/total.json'

type StateEntry = {
	date: string
	state: string
	deaths: string
	newDeaths: string
	newCases: string
	totalCases: string
}

const cleanData = data.map(
	({ date, state, deaths, newDeaths, newCases, totalCases }: StateEntry) => ({
		date,
		state,
		deaths,
		newDeaths,
		newCases,
		totalCases,
	}),
)

const removeSlashes = (s: string) => s.replace(/-/g, '')
const toInt = (s: string) => Number.parseInt(s)
const dateToInt = (s: string) => toInt(removeSlashes(s))
const toDate = (s: string) => s.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
const IntToDate = (i: number) => toDate(String(i))
const getDates = ({ date }: StateEntry) => date
const dates = cleanData.map(getDates)
const groupByDate = groupBy(getDates)
const pickLatest = (acc: number, curr: string) => Math.max(dateToInt(curr), acc)
const latestDate = IntToDate(dates.reduce(pickLatest, 0))
const byDate = groupByDate(cleanData)

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const currentDate = dates[index]
	return (
		<>
			<input
				type='range'
				min='0'
				max={dates.length - 1}
				value={index}
				onChange={({ target }) => setIndex(parseInt(target.value))}
			/>
			<pre>{JSON.stringify(byDate[currentDate], null, 2)}</pre>
		</>
	)
}

export default App
