import React, { useState, useMemo } from 'react'
import styled from 'styled-components'

import StatesTable from 'components/StatesTable'
import StatesMap from 'components/StatesMap'
import Container from 'components/Container'
import Grid from 'components/Grid'
import Text from 'components/Text'
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

const TitleHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 2rem 0.5rem;
`

const options = { day: 'numeric', month: 'numeric', year: 'numeric' }

const dateToString = (d: string, l: string = 'en') =>
	new Date(d).toLocaleDateString(l, options)

const App = () => {
	const [index, setIndex] = useState<number>(dates.length - 1)
	const [relative, setRelative] = useState<boolean>(false)
	const data: StateEntry[] = useMemo(() => main[dates[index]], [index])
	const total: StateEntry = useMemo(() => totals[dates[index]], [index])

	return (
		<Layout>
			<Container>
				<TitleHeader>
					<Text as='h1' weight={400} xs={3} md={4} lg={5}>
						Brazil
					</Text>
					<Text weight={400} xs={2} md={3}>
						{dateToString(dates[index])}
					</Text>
				</TitleHeader>
				<Grid.Row>
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
						<StatesMap data={data} scaleProp={relative ? 'ptc' : 'tc'} />
					</Grid.Column>
				</Grid.Row>
			</Container>
			<RangeInput
				value={index}
				onChange={setIndex}
				dates={dates}
				totals={totals}
				scaleProp={relative ? 'ptc' : 'tc'}
			/>
		</Layout>
	)
}

export default App
