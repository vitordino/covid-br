// @ts-nocheck
import React, { useMemo, useLayoutEffect } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import statesMeta from 'data/statesMeta.json'
import useStore from 'store'
import dateToString from 'utils/dateToString'
import fetcher from 'utils/fetcher'
import useRelativeSortSync from 'hooks/useRelativeSortSync'
import Container from 'components/Container'
import Grid from 'components/Grid'
import TitleHeader from 'components/TitleHeader'
import RelativeAndDailySwitcher from 'components/RelativeAndDailySwitcher'
import StatsCard from 'components/StatsCard'
import StateTable from 'components/Table/StateTable'
import RangeInput from 'components/RangeInput'

const OuterGrid = styled(Grid.Row)`
	align-items: stretch;
`

type StateProps = {
	id: keyof typeof StatesEnum
}

const getStateName = (id: keyof typeof StatesEnum) => statesMeta?.[id]?.n

type StateDataType = {
	main: {
		[key: string]: CityEntry[]
	}
	totals: {
		[key: string]: CityEntry
	}
	dates: DatesEnum[]
}

interface InnerProps extends StateDataType {
	id: keyof typeof StatesEnum
}

const Inner = ({ id, main, totals, dates }: InnerProps) => {
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	const relative = useStore(s => s.relative)
	const hoveredState = useStore(s => s.hoveredState)
	/* eslint-disable react-hooks/exhaustive-deps */
	const total = useMemo(() => totals[dates[dateIndex]] || {}, [dateIndex])
	const data = useMemo(() => main[dates[dateIndex]] || [], [dateIndex])

	const hoveredData = hoveredState
		? data?.find(({ id }) => id === hoveredState)
		: total

	const hoveredTimeSeries: CityEntry[] = useMemo(
		() =>
			hoveredState
				? Object.values(main)
						.flatMap(x => x)
						.filter(x => x.id === hoveredState)
				: Object.values(totals),
		[hoveredState],
	)
	/* eslint-enable react-hooks/exhaustive-deps */

	const caseProp = relative ? 'ptc' : 'tc'
	const deathProp = relative ? 'ptd' : 'td'

	useLayoutEffect(() => {
		setDateIndex(dates.length - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useRelativeSortSync()

	return (
		<>
			<Container>
				<TitleHeader
					title={getStateName(id)}
					options={dates}
					value={dateIndex.toString()}
					onChange={v => setDateIndex(parseInt(v))}
					renderOption={dateToString}
				/>
				<OuterGrid>
					<Grid.Column xs={16} lg={10}>
						<RelativeAndDailySwitcher visibleOn={['xs', 'sm', 'md']} />
						<StateTable data={data} total={total} />
					</Grid.Column>
					<Grid.Column xs={16} lg={6}>
						<RelativeAndDailySwitcher visibleOn={['lg', 'xg']} />
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
					</Grid.Column>
				</OuterGrid>
			</Container>
			<RangeInput<CityEntry> dates={dates} totals={totals} />
		</>
	)
}

const State = ({ id }: StateProps) => {
	const { data, error } = useSWR<any>(`/data/${id}.json`, fetcher, {
		suspense: true,
	})
	if (!data || error) return null
	const { main, dates, totals } = data
	return <Inner id={id} main={main} dates={dates} totals={totals} />
}

export default State
