// @ts-nocheck
import React, { useMemo, useLayoutEffect, lazy, Suspense } from 'react'
import useSWR from 'swr'

import useStore from 'store'
import fetcher from 'utils/fetcher'
import Container from 'components/Container'
import Loader from 'components/Loader'
import Grid from 'components/Grid'

const CountryMap = lazy(() => import('../components/CountryMap'))
const StatsCard = lazy(() => import('../components/StatsCard'))

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

	// @ts-ignore
	const hoveredTitle = states?.[hoveredState]?.n || 'Total'
	const hoveredData = hoveredState
		? data?.find(({ st }) => st === hoveredState)
		: total

	useLayoutEffect(() => {
		setDateIndex(dates.length - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<>
			<Container style={{ margin: 'auto' }}>
				<Suspense fallback={<Loader />}>
					<Grid.Row style={{ alignItems: 'center' }}>
						<Grid.Column xs={7}>
							<CountryMap data={data} />
						</Grid.Column>
						<Grid.Column xs={2} />
						<Grid.Column xs={7}>
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
					</Grid.Row>
				</Suspense>
			</Container>
		</>
	)
}

const OpenGraph = () => {
	const { data, error } = useSWR<CountryDataType>(
		'/data/country.json',
		fetcher,
		{ suspense: true },
	)
	if (!data || error) return null
	const { main, totals, dates, states } = data
	return <Inner main={main} totals={totals} dates={dates} states={states} />
}

export default OpenGraph
