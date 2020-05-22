import React, { useMemo, useLayoutEffect } from 'react'
import useSWR from 'swr'

import statesMeta from 'data/statesMeta.json'
import useStore from 'store'
import dateToString from 'utils/dateToString'
import fetcher from 'utils/fetcher'
import Container from 'components/Container'
import Grid from 'components/Grid'
import TitleHeader from 'components/TitleHeader'
import RelativeAndDailySwitcher from 'components/RelativeAndDailySwitcher'
import StateTable from 'components/Table/StateTable'

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
	/* eslint-disable react-hooks/exhaustive-deps */
	const total = useMemo(() => totals[dates[dateIndex]] || {}, [dateIndex])
	const data = useMemo(() => main[dates[dateIndex]] || [], [dateIndex])
	/* eslint-enable react-hooks/exhaustive-deps */

	useLayoutEffect(() => {
		setDateIndex(dates.length - 1)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
				<Grid.Row>
					<Grid.Column xs={16} lg={10}>
						<RelativeAndDailySwitcher visibleOn={['xs', 'sm', 'md']} />
						<StateTable data={data} total={total} />
					</Grid.Column>
					<Grid.Column xs={16} lg={6}>
						<RelativeAndDailySwitcher visibleOn={['lg', 'xg']} />
					</Grid.Column>
				</Grid.Row>
			</Container>
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
