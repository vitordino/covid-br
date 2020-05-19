import React from 'react'
import useSWR from 'swr'

import fetcher from 'utils/fetcher'
import Container from 'components/Container'

type StateProps = {
	id: string
}

const State = ({ id }: StateProps) => {
	const { data, error } = useSWR<any>(
		`/data/${id}.json`,
		fetcher,
		{ suspense: true },
	)
	if(!data || error) return null
	return (
		<Container>
			<pre>{JSON.stringify({ data }, null, 2)}</pre>
		</Container>
	)
}

export default State
