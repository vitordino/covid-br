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
import SummaryCard from 'components/SummaryCard'
import Spacer from 'components/Spacer'
import SEO from 'components/SEO'

const CountryMap = lazy(() => import('../components/CountryMap'))
// @ts-ignore
const StatsCard = lazy(() => import('../components/StatsCard'))

const Sidebar = styled(Grid.Column)`
	position: sticky;
	top: 0.25rem;
	align-self: flex-start;
`

type CountryDataType = {
	main: Record<string, StateEntry[]>
	totals: Record<string, StateEntry>
	dates: string[]
	states: StatesMeta
}

const Inner = ({ main, totals, dates, states }: CountryDataType) => {
	const datesLength = dates.length
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
		[hoveredState, main, totals, datesLength],
	)
	/* eslint-enable react-hooks/exhaustive-deps */
	const caseProp = relative ? 'ptc' : 'tc'
	const deathProp = relative ? 'ptd' : 'td'
	const recoveredProp = relative ? 'ptr' : 'tr'

	const hasRange = datesLength > 1

	// @ts-ignore
	const hoveredTitle = states[hoveredState]?.n || 'Total'
	const hoveredData = hoveredState
		? data?.find(({ st }) => st === hoveredState)
		: total

	useLayoutEffect(() => {
		reset()
	}, [reset])

	useLayoutEffect(() => {
		setDateIndex(datesLength - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setDateIndex, datesLength])

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
				<Suspense fallback={<Loader />}>
					<Grid.Row>
						<Grid.Column xs={16} lg={16 / 3}>
							<SummaryCard<StateEntry> prop={caseProp} data={total} />
						</Grid.Column>
						<Grid.Column xs={16} lg={16 / 3}>
							<SummaryCard<StateEntry> prop={deathProp} data={total} />
						</Grid.Column>
						<Grid.Column xs={16} lg={16 / 3}>
							<SummaryCard<StateEntry> prop={recoveredProp} data={total} />
						</Grid.Column>
					</Grid.Row>
				</Suspense>
				<Spacer.V xs={2} />
				<Grid.Row>
					<Grid.Column xs={16} lg={10} xg={12}>
						<RelativeAndDailySwitcher visibleOn={['xs', 'sm', 'md']} />
						{data && (
							<CountryTable
								data={data}
								total={total}
								statesMeta={states}
								hasRange={hasRange}
							/>
						)}
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
			<RangeInput dates={dates} totals={totals} />
		</>
	)
}

const Home = () => {
	const { data: latestData, error } = useSWR<CountryDataType>(
		'/data/country-latest.json',
		fetcher,
		{ suspense: true },
	)
	const { data } = useSWR<CountryDataType>('/data/country.json', fetcher)
	if (!latestData || error) return null
	const { main, totals, dates, states } = data || latestData
	return <Inner main={main} totals={totals} dates={dates} states={states} />
}

export default Home
