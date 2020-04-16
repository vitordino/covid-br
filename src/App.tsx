import React, { useState, useMemo } from 'react'

import BaseTrend from './components/Trend'
import StatesTable from './components/StatesTable'
import Container from './components/Container'
import Grid from './components/Grid'
import Layout from './components/Layout'

import type { StateEntry, StateEntries } from './components/StatesTable'

import data from './data/states.json'

const Trend = (props: any) => (
	<BaseTrend
		smooth
		autoDraw
		autoDrawEasing='ease-out'
		gradient={['#00c6ff', '#F0F', '#FF0']}
		radius={5}
		strokeWidth={2}
		strokeLinecap={'round'}
		{...props}
	/>
)

export type Main = {
	[key: string]: StateEntry[]
}

const main: Main = data.main
const dates: string[] = data.dates

const removeTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st !== 'TOTAL')

const findTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st === 'TOTAL')[0]

const identity = (x: any) => x
const x = Object.values(main)
	.flatMap(identity)
	.filter(({ st }) => st === 'TOTAL')
	.map((x) => parseInt(x.tc))

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const data: StateEntries = useMemo(() => removeTotal(main[dates[index]]), [
		index,
	])
	const total: StateEntry = useMemo(() => findTotal(main[dates[index]]), [
		index,
	])

	return (
		<Layout>
			<Container>
				<Grid.Row>
					<Grid.Column xs={8} md={4}>
						<Trend data={x} />
					</Grid.Column>
				</Grid.Row>
				<input
					type='range'
					min='0'
					max={dates.length - 1}
					value={index}
					onChange={({ target }) => setIndex(parseInt(target.value))}
				/>
				<pre>{dates[index]}</pre>
				<Grid.Row>
					<Grid.Column xs={16} lg={8}>
						<StatesTable data={data} total={total} />
					</Grid.Column>
				</Grid.Row>
			</Container>
		</Layout>
	)
}

export default App
