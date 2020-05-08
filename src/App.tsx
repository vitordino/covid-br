import React, { useMemo, useLayoutEffect } from 'react'
import styled from 'styled-components'

import useStore from 'store'
import useRelativeSortSync from 'hooks/useRelativeSortSync'
import StatesTable from 'components/StatesTable'
import StatesMap from 'components/StatesMap'
import Container from 'components/Container'
import Grid from 'components/Grid'
import Text from 'components/Text'
import Layout from 'components/Layout'
import RangeInput from 'components/RangeInput'
import StatsCard from 'components/StatsCard'

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
	const hoveredState = useStore(s => s.hoveredState)
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	const data: StateEntry[] = useMemo(() => main[dates[dateIndex]], [dateIndex])
	const total: StateEntry = useMemo(() => totals[dates[dateIndex]], [dateIndex])

	const caseProp = relative ? 'ptc' : 'tc'
	const deathProp = relative ? 'ptd' : 'td'
	const recoveredProp = relative ? 'ptr' : 'tr'

	// @ts-ignore
	const title = statesMeta?.[hoveredState]?.n || 'Brazil'
	const hoveredData = data?.find(({ st }) => st === hoveredState) || total

	useLayoutEffect(() => {
		setDateIndex(dates.length - 1)
	}, [setDateIndex])

	useRelativeSortSync()

	return (
		<Layout>
			<Container>
				<TitleHeader>
					<Text as='h1' weight={400} xs={3} md={4} lg={5}>
						{title}
					</Text>
					<Text weight={400} xs={2} md={3}>
						<select
							value={dateIndex}
							onChange={({ target }) => setDateIndex(parseInt(target.value))}
						>
							{dates.map((x, i) => (
								<option key={x} value={i}>{dateToString(x)}</option>
							))}
						</select>
						{/* {dateToString(dates[dateIndex])} */}
					</Text>
				</TitleHeader>
				<Grid.Row>
					<Grid.Column xs={16} lg={10}>
						<StatesTable data={data} total={total} statesMeta={statesMeta} />
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
						<StatsCard prop={caseProp} data={hoveredData} />
						<StatsCard prop={deathProp} data={hoveredData} />
						<StatsCard prop={recoveredProp} data={hoveredData} />
					</Grid.Column>
				</Grid.Row>
			</Container>
			<RangeInput dates={dates} totals={totals} />
		</Layout>
	)
}

export default App
