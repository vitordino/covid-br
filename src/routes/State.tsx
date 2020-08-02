import React, { useMemo, useLayoutEffect, lazy, Suspense } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import statesMeta from 'data/statesMeta.json'
import useStore from 'store'
import dateToString from 'utils/dateToString'
import fetcher from 'utils/fetcher'
import useRelativeSortSync from 'hooks/useRelativeSortSync'
import SEO from 'components/SEO'
import Container from 'components/Container'
import Grid from 'components/Grid'
import Loader from 'components/Loader'
import Text from 'components/Text'
import Spacer from 'components/Spacer'
import TitleHeader from 'components/TitleHeader'
import SummaryCard from 'components/SummaryCard'
import RelativeAndDailySwitcher from 'components/RelativeAndDailySwitcher'
import StateTable from 'components/Table/StateTable'
import RangeInput from 'components/RangeInput'

// @ts-ignore
const StatsCard = lazy(() => import('../components/StatsCard'))

const Sidebar = styled(Grid.Column)`
	position: sticky;
	top: 0.25rem;
	align-self: flex-start;
`

type StateProps = {
	id: keyof typeof StatesEnum
}

const getStateName = (id: keyof typeof StatesEnum) => statesMeta?.[id]?.n

type StateDataType = {
	main: Record<string, CityEntry[]>
	totals: Record<string, CityEntry>
	dates: string[]
}

interface InnerProps extends StateDataType {
	id: keyof typeof StatesEnum
}

const Inner = ({ id, main, totals, dates }: InnerProps) => {
	const datesLength = dates.length
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	const relative = useStore(s => s.relative)
	const hoveredState = useStore(s => s.hoveredState)
	const reset = useStore(s => s.reset)
	/* eslint-disable react-hooks/exhaustive-deps */
	const total = useMemo(() => totals[dates[dateIndex]] || {}, [dateIndex])
	const data = useMemo(() => main[dates[dateIndex]] || [], [dateIndex])

	const hoveredData = hoveredState
		? data?.find(({ ct }) => ct === hoveredState)
		: total

	const hoveredTimeSeries: CityEntry[] = useMemo(
		() =>
			hoveredState
				? Object.values(main)
						.flatMap(x => x)
						.filter(x => x.ct === hoveredState)
				: Object.values(totals),
		[hoveredState, datesLength],
	)
	/* eslint-enable react-hooks/exhaustive-deps */

	const caseProp = relative ? 'ptc' : 'tc'
	const deathProp = relative ? 'ptd' : 'td'

	const hasRange = datesLength > 1

	useLayoutEffect(() => {
		reset()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useLayoutEffect(() => {
		setDateIndex(datesLength - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datesLength])

	useRelativeSortSync()

	return (
		<>
			<SEO title={getStateName(id)} />
			<Container>
				<TitleHeader
					title={getStateName(id)}
					options={dates}
					value={dateIndex.toString()}
					onChange={v => setDateIndex(parseInt(v))}
					renderOption={dateToString}
				/>
				<Suspense fallback={<Loader />}>
					<Grid.Row>
						<Grid.Column xs={16} lg={8}>
							<SummaryCard<CityEntry> prop={caseProp} data={total} />
						</Grid.Column>
						<Grid.Column xs={16} lg={8}>
							<SummaryCard<CityEntry> prop={deathProp} data={total} />
						</Grid.Column>
					</Grid.Row>
				</Suspense>
				<Spacer.V xs={2} />
				<Grid.Row>
					<Grid.Column xs={16} lg={10}>
						<RelativeAndDailySwitcher visibleOn={['xs', 'sm', 'md']} />
						<StateTable data={data} total={total} hasRange={hasRange} />
					</Grid.Column>
					<Sidebar xs={16} lg={6}>
						<RelativeAndDailySwitcher visibleOn={['lg', 'xg']} />
						<Spacer.V xs={1.5} />
						<Text
							weight={400}
							xs={2}
							md={3}
							style={{ margin: '0 1rem -0.5rem' }}
						>
							{hoveredState || 'Total'}
						</Text>
						<Suspense fallback={<Loader />}>
							<StatsCard<CityEntry>
								prop={caseProp}
								data={hoveredData}
								chartData={hoveredTimeSeries}
								dates={dates}
							/>
							<StatsCard<CityEntry>
								prop={deathProp}
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

const State = ({ id }: StateProps) => {
	const { data: latestData, error } = useSWR<any>(
		`/data/${id}-latest.json`,
		fetcher,
		{ suspense: true },
	)
	const { data } = useSWR<any>(`/data/${id}.json`, fetcher)
	if (!latestData || error) return null
	const { main, dates, totals } = data || latestData
	return <Inner id={id} main={main} dates={dates} totals={totals} />
}

export default State
