import React, { useState, useMemo } from 'react'

import BaseTrend from './components/Trend'
import StatesTable from './components/StatesTable'
import StatesMap from './components/StatesMap'
import Container from './components/Container'
import Grid from './components/Grid'
import Layout from './components/Layout'

import type { StateEntry, StatesMeta } from './components/StatesTable'

import data from './data/states.json'

export type Main = {
	[key: string]: StateEntry[]
}

const main: Main = data.main
const dates: string[] = data.dates
const statesMeta: StatesMeta = data.states

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

const removeTotal = (lines: StateEntry[]) =>
	lines.filter(({ st }) => st !== 'TOTAL')

const findTotal = (lines: StateEntry[]) =>
	lines.filter(({ st }) => st === 'TOTAL')[0]

const identity = (x: any) => x
const trendData = Object.values(main)
	.flatMap(identity)
	.filter(({ st }) => st === 'TOTAL')
	.map((x) => x.tc)

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const data: StateEntry[] = useMemo(() => removeTotal(main[dates[index]]), [
		index,
	])
	const total: StateEntry = useMemo(() => findTotal(main[dates[index]]), [
		index,
	])

	return (
		<Layout>
			<Container>
				<Grid.Row vertical-gutter>
					<Grid.Column xs={16} lg={8}>
						<input
							type='range'
							min={0}
							max={dates.length - 1}
							value={index}
							onChange={({ target }) => setIndex(parseInt(target.value))}
						/>
						<pre>{dates[index]}</pre>
						<Trend data={trendData} />
						<StatesTable data={data} total={total} statesMeta={statesMeta} />
					</Grid.Column>
					<Grid.Column xs={16} lg={8}>
						<StatesMap data={data} />
					</Grid.Column>
				</Grid.Row>
			</Container>
		</Layout>
	)
}

export default App
