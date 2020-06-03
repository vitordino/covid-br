// @ts-nocheck
import React, { useMemo, useLayoutEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import useStore from 'store'
import dateToString from 'utils/dateToString'
import fetcher from 'utils/fetcher'
import useRelativeSortSync from 'hooks/useRelativeSortSync'
import CountryTable from 'components/Table/CountryTable'
import CountryMap from 'components/CountryMap'
import RelativeAndDailySwitcher from 'components/RelativeAndDailySwitcher'
import Container from 'components/Container'
import Grid from 'components/Grid'
import Text from 'components/Text'
import RangeInput from 'components/RangeInput'
import StatsCard from 'components/StatsCard'
import TitleHeader from 'components/TitleHeader'

const OuterGrid = styled(Grid.Row)`
	align-items: stretch;
`

type CountryDataType = {
	main: Main
	totals: Totals
	dates: DatesEnum[]
	states: StatesMeta
}

const Inner = ({ main, totals, dates, states }: CountryDataType) => {
	const hoveredState = useStore(s => s.hoveredState)
	const relative = useStore(s => s.relative)
	/* eslint-disable react-hooks/exhaustive-deps */
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	const data: StateEntry[] = useMemo(() => main[dates[dateIndex]], [dateIndex])
	const total: StateEntry = useMemo(() => totals[dates[dateIndex]], [dateIndex])
	const hoveredTimeSeries: StateEntry[] = useMemo(
		() =>
			hoveredState
				? Object.values(main)
						.flatMap(x => x)
						.filter(x => x.st === hoveredState)
				: Object.values(totals),
		[hoveredState],
	)
	/* eslint-enable react-hooks/exhaustive-deps */
	const caseProp = relative ? 'ptc' : 'tc'
	const deathProp = relative ? 'ptd' : 'td'
	const recoveredProp = relative ? 'ptr' : 'tr'

	// @ts-ignore
	const hoveredTitle = states?.[hoveredState]?.n || 'Total'
	const hoveredData = hoveredState
		? data?.find(({ st }) => st === hoveredState)
		: total

	useLayoutEffect(() => {
		setDateIndex(dates.length - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useRelativeSortSync()

	return (
		<>
			<Container>
				<TitleHeader
					title='Brazil'
					options={dates}
					value={dateIndex.toString()}
					onChange={v => setDateIndex(parseInt(v))}
					renderOption={dateToString}
				/>
				<OuterGrid>
					<Grid.Column xs={16} lg={10}>
						<RelativeAndDailySwitcher visibleOn={['xs', 'sm', 'md']} />
						<CountryTable data={data} total={total} statesMeta={states} />
					</Grid.Column>
					<Grid.Column xs={16} lg={6}>
						<RelativeAndDailySwitcher visibleOn={['lg', 'xg']} />
						<CountryMap data={data} />
						<Text
							weight={400}
							xs={2}
							md={3}
							style={{ margin: '0 1rem -0.5rem' }}
						>
							{hoveredTitle}
						</Text>
						<StatsCard<StateEntry>
							prop={caseProp}
							data={hoveredData}
							chartData={hoveredTimeSeries}
							dates={dates}
						/>
						<StatsCard<StateEntry>
							prop={deathProp}
							data={hoveredData}
							chartData={hoveredTimeSeries}
							dates={dates}
						/>
						<StatsCard<StateEntry>
							prop={recoveredProp}
							data={hoveredData}
							chartData={hoveredTimeSeries}
							dates={dates}
						/>
					</Grid.Column>
				</OuterGrid>
			</Container>
			<RangeInput<StateEntry> dates={dates} totals={totals} />
		</>
	)
}

const Home = () => {
	const { data, error } = useSWR<CountryDataType>(
		'/data/country.json',
		fetcher,
		{ suspense: true },
	)
	if (!data || error) return null
	const { main, totals, dates, states } = data
	return <Inner main={main} totals={totals} dates={dates} states={states} />
}

export default Home
