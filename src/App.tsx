import React, { useState, useMemo } from 'react'
import styled from 'styled-components'

import useStore from 'store'
import StatesTable from 'components/StatesTable'
import StatesMap from 'components/StatesMap'
import Container from 'components/Container'
import Grid from 'components/Grid'
import Text from 'components/Text'
import Layout from 'components/Layout'
import RangeInput from 'components/RangeInput'

import data from 'data/states.json'

// @ts-ignore
const main: Main = data.main
// @ts-ignore
const totals: Totals = data.totals

const dates: DatesEnum[] = data.dates
const statesMeta: StatesMeta = data.states

const TitleHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 2rem 0.5rem;
`

const options = { day: 'numeric', month: 'numeric', year: 'numeric' }

const dateToString = (d: string, l: string = 'pt') =>
	new Date(d).toLocaleDateString(l, options)

const App = () => {
	const sort = useStore(s => s.sort)
	const hoveredState = useStore(s => s.hoveredState)
	const [index, setIndex] = useState<number>(dates.length - 1)
	const [relative, setRelative] = useState<boolean>(false)
	const data: StateEntry[] = useMemo(() => main[dates[index]], [index])
	const total: StateEntry = useMemo(() => totals[dates[index]], [index])

	// @ts-ignore
	const title = statesMeta?.[hoveredState]?.n || 'Brazil'

	return (
		<Layout>
			<Container>
				<TitleHeader>
					<Text as='h1' weight={400} xs={3} md={4} lg={5}>
						{title}
					</Text>
					<Text weight={400} xs={2} md={3}>
						{dateToString(dates[index])}
					</Text>
				</TitleHeader>
				<Grid.Row>
					<Grid.Column xs={16} lg={10}>
						<StatesTable
							data={data}
							total={total}
							statesMeta={statesMeta}
							relative={relative}
						/>
					</Grid.Column>
					<Grid.Column xs={16} lg={6}>
						<label>
							{JSON.stringify({ relative })}
							<input
								type='checkbox'
								checked={relative}
								onChange={({ target }) => setRelative(target.checked)}
							/>
						</label>
						<StatesMap data={data} />
					</Grid.Column>
				</Grid.Row>
			</Container>
			<RangeInput
				value={index}
				onChange={setIndex}
				dates={dates}
				totals={totals}
			/>
		</Layout>
	)
}

export default App
