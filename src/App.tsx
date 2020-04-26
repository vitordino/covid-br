import React, { useState, useMemo } from 'react'

import BaseTrend from 'components/Trend'
import StatesTable from 'components/StatesTable'
import StatesMap from 'components/StatesMap'
import Container from 'components/Container'
import Grid from 'components/Grid'
import Layout from 'components/Layout'
import RangeInput from 'components/RangeInput'

import type { StateEntry, StatesMeta } from 'components/StatesTable'

import data from 'data/states.json'

type HashMapOf<T> = { [key: string]: T }
export type Main = HashMapOf<StateEntry[]>
export type Totals = HashMapOf<StateEntry>

const main: Main = data.main
const totals: Totals = data.totals
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

const trendData = Object.values(totals).map(({ tc }) => tc)

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const [relative, setRelative] = useState(true)
	const data: StateEntry[] = useMemo(() => main[dates[index]], [index])
	const total: StateEntry = useMemo(() => totals[dates[index]], [index])

	return (
		<Layout>
			<RangeInput
				value={index}
				onChange={setIndex}
				dates={dates}
				totals={totals}
			/>
			<Container>
				<Grid.Row vertical-gutter>
					<Grid.Column xs={16} lg={8}>
						<StatesTable
							data={data}
							total={total}
							statesMeta={statesMeta}
							relative={relative}
						/>
					</Grid.Column>
					<Grid.Column xs={16} lg={8}>
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
						<StatesMap data={data} scaleProp={relative ? 'ptc' : 'tc'} />
					</Grid.Column>
				</Grid.Row>
			</Container>
		</Layout>
	)
}

export default App
