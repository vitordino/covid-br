import React, { useMemo, useLayoutEffect, lazy, Suspense } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import useStore from 'store'
import dateToString from 'utils/dateToString'
import fetcher from 'utils/fetcher'
import useRelativeSortSync from 'hooks/useRelativeSortSync'
import CountryTable from 'components/Table/CountryTable'
import RelativeAndDailySwitcher from 'components/RelativeAndDailySwitcher'
import Container from 'components/Container'
import Loader from 'components/Loader'
import Grid from 'components/Grid'
import Text from 'components/Text'
import RangeInput from 'components/RangeInput'
import TitleHeader from 'components/TitleHeader'
import SEO from 'components/SEO'

const CountryMap = lazy(() => import('../components/CountryMap'))
const StatsCard = lazy(() => import('../components/StatsCard'))

const Sidebar = styled(Grid.Column)`
	position: sticky;
	top: 0.25rem;
	align-self: flex-start;
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
	const reset = useStore(s => s.reset)
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	/* eslint-disable react-hooks/exhaustive-deps */
	const data: StateEntry[] = useMemo(() => main[dates[dateIndex]], [
		dateIndex,
		dates,
		main,
	])
	const total: StateEntry = useMemo(() => totals[dates[dateIndex]], [
		dateIndex,
		dates,
		totals,
	])
	const hoveredTimeSeries: StateEntry[] = useMemo(
		() =>
			hoveredState
				? Object.values(main)
						.flatMap(x => x)
						.filter(x => x.st === hoveredState)
				: Object.values(totals),
		[hoveredState, main, totals],
	)
	/* eslint-enable react-hooks/exhaustive-deps */
	const caseProp = relative ? 'ptc' : 'tc'
	const deathProp = relative ? 'ptd' : 'td'
	const recoveredProp = relative ? 'ptr' : 'tr'

	const hoveredTitle = states[hoveredState]?.n || 'Total'
	const hoveredData = hoveredState
		? data?.find(({ st }) => st === hoveredState)
		: total

	useLayoutEffect(() => {
		reset()
		setDateIndex(dates.length - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useRelativeSortSync()

	return (
		<>
			<SEO title='Covid-19 no Brasil' />
			<Container>
				<TitleHeader
					title='Brasil'
					options={dates}
					value={dateIndex.toString()}
					onChange={v => setDateIndex(parseInt(v))}
					renderOption={dateToString}
				/>
				<Grid.Row>
					<Grid.Column xs={16} lg={10} xg={12}>
						<RelativeAndDailySwitcher visibleOn={['xs', 'sm', 'md']} />
						<CountryTable data={data} total={total} statesMeta={states} />
					</Grid.Column>
					<Sidebar xs={16} lg={6} xg={4}>
						<RelativeAndDailySwitcher visibleOn={['lg', 'xg']} />
						<Suspense fallback={<Loader />}>
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
						</Suspense>
					</Sidebar>
				</Grid.Row>
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
