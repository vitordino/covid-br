import React, { useMemo, useLayoutEffect } from 'react'
import useSWR from 'swr'

import statesMeta from 'data/statesMeta.json'
import useStore from 'store'
import dateToString from 'utils/dateToString'
import fetcher from 'utils/fetcher'
import Container from 'components/Container'
import TitleHeader from 'components/TitleHeader'
import RangeInput from 'components/RangeInput'

type StateProps = {
	id: keyof typeof StatesEnum
}

const getStateName = (id: keyof typeof StatesEnum) => statesMeta?.[id]?.n

type StateDataType = {
	main: Main
	totals: Totals
	dates: DatesEnum[]
}

interface InnerProps extends StateDataType {
	id: keyof typeof StatesEnum
}

const Inner = ({ id, main, totals, dates }: InnerProps) => {
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	/* eslint-disable react-hooks/exhaustive-deps */
	const total = useMemo(() => totals[dates[dateIndex]], [dateIndex])
	const data = useMemo(() => main[dates[dateIndex]], [dateIndex])
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

				<pre>{JSON.stringify({ data, total }, null, 2)}</pre>
			</Container>
			<RangeInput dates={dates} totals={totals} />
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
