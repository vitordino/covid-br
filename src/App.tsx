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
const totalsMain: Main = data.totals
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

const identity = (x: any) => x
const trendData = Object.values(totalsMain)
	.flatMap(identity)
	.map(x => x.tc)

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const [relative, setRelative] = useState(true)
	const data: StateEntry[] = useMemo(() => main[dates[index]], [index])
	const total: StateEntry = useMemo(() => totalsMain[dates[index]][0], [index])

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
						<label>
							{JSON.stringify({ relative })}
							<input
								type='checkbox'
								checked={relative}
								onChange={({ target }) => setRelative(target.checked)}
							/>
						</label>
						<pre>{dates[index]}</pre>
						<Trend data={trendData} />
						<StatesTable
							data={data}
							total={total}
							statesMeta={statesMeta}
							relative={relative}
						/>
					</Grid.Column>
					<Grid.Column xs={16} lg={8}>
						<StatesMap data={data} scaleProp={relative ? 'ptc' : 'tc'} />
					</Grid.Column>
				</Grid.Row>
			</Container>
		</Layout>
	)
}

export default App
