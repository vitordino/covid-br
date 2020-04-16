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

const getDates = ({ date }: StateEntry) => date
const dates = cleanData.map(getDates)
const groupByDate = groupBy(getDates)
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
