import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Totals } from 'App'

type RangeInputProps = {
	value: number
	onChange: (value: number) => void
	dates: string[]
	totals: Totals
}

const Wrapper = styled.label`
	display: block;
	position: sticky;
	top: 0;
	z-index: 10;
	margin-bottom: 0.125rem;
`

const Field = styled.input`
	position: relative;
	display: block;
	width: 100%;
`

type StripProps = {
	total: number
	children?: ReactNode
}

const Track = styled.div`
	display: flex;
	position: absolute;
	width: 100%;
	height: 100%;
`

const Strip = styled.div<StripProps>`
	width: calc(100% / ${p => p.total});
	height: 100%;
	overflow: hidden;
`

const RangeInput = ({ value, onChange, dates, totals }: RangeInputProps) => (
	<Wrapper>
		<Track>
			{dates.map(x => (
				<Strip total={dates.length}>{totals[x].tc}</Strip>
			))}
		</Track>
		<Field
			type='range'
			min={0}
			max={dates.length - 1}
			value={value}
			onChange={({ target }) => onChange(parseInt(target.value))}
		/>
	</Wrapper>
)

export default RangeInput
