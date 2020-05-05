import React, { ReactNode } from 'react'
import styled from 'styled-components'

import useStore from 'store'

const Wrapper = styled.div``

type StatsCardProps = {
	hoveredData?: StateEntry
	label?: ReactNode
	main?: ReactNode
	mainAlt?: ReactNode
	sub?: ReactNode
	subAlt?: ReactNode
}

type DataMappingOf<T> = {
	main: keyof T
	mainAlt: keyof T
	sub: keyof T
	subAlt: keyof T
}

type DataMappingsOf<T> = {
	[K in keyof T]?: DataMappingOf<T>
}

const dataMappingsBySort: DataMappingsOf<StateEntry> = {
	tc: {
		main: 'tc',
		mainAlt: 'nc',
		sub: 'ptc',
		subAlt: 'pnc',
	},
	ptc: {
		main: 'ptc',
		mainAlt: 'pnc',
		sub: 'tc',
		subAlt: 'nc',
	},
	td: {
		main: 'td',
		mainAlt: 'nd',
		sub: 'ptd',
		subAlt: 'pnd',
	},
	ptd: {
		main: 'ptd',
		mainAlt: 'pnd',
		sub: 'td',
		subAlt: 'nd',
	},
	tr: {
		main: 'tr',
		mainAlt: 'nr',
		sub: 'ptr',
		subAlt: 'pnr',
	},
	ptr: {
		main: 'ptr',
		mainAlt: 'pnr',
		sub: 'tr',
		subAlt: 'nr',
	},
}

const StatsCard = ({ label, hoveredData, ...props }: StatsCardProps) => {
	const sort = useStore(s => s.sort)
	const { main, mainAlt, sub, subAlt } = dataMappingsBySort?.[sort] || {}

	return (
		<Wrapper {...props}>
			{label && <div>{label}</div>}
			<div>
				{!!main && <strong>{hoveredData?.[main]}</strong>}
				{!!main && !!mainAlt && ' '}
				{!!mainAlt && <span>{hoveredData?.[mainAlt]}</span>}
			</div>
			<div>
				{!!sub && <strong>{hoveredData?.[sub]}</strong>}
				{!!sub && !!subAlt && ' '}
				{!!subAlt && <span>{hoveredData?.[subAlt]}</span>}
			</div>
		</Wrapper>
	)
}

export default StatsCard
