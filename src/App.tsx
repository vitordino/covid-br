import React, { useState, useMemo } from 'react'
import StatesTable from './components/StatesTable'
import type { StateEntry, StateEntries } from './components/StatesTable'

import data from './data/states.json'

export type Main = {
	[key: string]: StateEntry[]
}

const main: Main = data.main
const dates: string[] = data.dates

const removeTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st !== 'TOTAL')

const findTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st === 'TOTAL')[0]

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const data: StateEntries = useMemo(() => removeTotal(main[dates[index]]), [
		index,
	])
	const total: StateEntry = useMemo(() => findTotal(main[dates[index]]), [
		index,
	])

	return (
		<>
			<input
				type='range'
				min='0'
				max={dates.length - 1}
				value={index}
				onChange={({ target }) => setIndex(parseInt(target.value))}
			/>
			<pre>{dates[index]}</pre>
			<StatesTable data={data} total={total} />
		</>
	)
}

export default App
