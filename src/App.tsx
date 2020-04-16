import React, { useState } from 'react'
import data from './data/states.json'

type State = {
	date: string
	st: string
	td: string
	nd: string
	nc: string
	tc: string
}

interface States {
	[key: string]: State[]
}

const main: States = data.main
const dates: Array<string> = data.dates

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const selectedData = main[dates[index]]
	return (
		<>
			<input
				type='range'
				min='0'
				max={dates.length - 1}
				value={index}
				onChange={({ target }) => setIndex(parseInt(target.value))}
			/>
			<pre>{JSON.stringify(selectedData, null, 2)}</pre>
		</>
	)
}

export default App
