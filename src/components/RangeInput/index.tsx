import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import useStore from 'store'
import { getRangeFill } from 'utils/colorScale'

type RangeInputProps = {
	dates: string[]
	totals: Totals
}

const Wrapper = styled.label`
	display: flex;
	position: fixed;
	width: 100%;
	bottom: 0;
	z-index: 1;
	height: 0.75rem;
	transition: height 0.2s;
	box-shadow: 0 0 0 0.125rem var(--color-base00);
	&:hover {
		overflow: visible;
		height: 1.25rem;
		z-index: 10;
	}
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
`

const thumbStyle = ({ max, color }: { max: number; color: string }) => css`
	appearance: none;
	height: 1.5rem;
	width: calc(100% / ${max});
	background: ${color};
	cursor: ew-resize;
	transition: 0.2s transform;
	box-shadow: 0 0 0 0.125rem var(--color-base00);
	will-change: transform;
	border-radius: 0;
	margin-bottom: -0.25rem;
	&:hover,
	&:focus,
	&:active {
		transform: scaleY(2.5);
	}
`

const Field = styled.input`
	position: absolute;
	display: block;
	width: 100%;
	appearance: none;
	height: 0.75rem;
	cursor: pointer;
	height: 100%;
	&:focus {
		outline: none;
	}
	&::-webkit-slider-thumb {
		${thumbStyle}
	}
	&::-moz-range-thumb {
		${thumbStyle}
	}
	&::-ms-thumb {
		${thumbStyle}
	}
`

type StripProps = {
	total: number
	children?: ReactNode
	fill: string
}

const Strip = styled.div<StripProps>`
	width: calc(100% / ${p => p.total});
	height: 100%;
	overflow: hidden;
	background: ${p => p.fill};
`

const RangeInput = ({ dates, totals }: RangeInputProps) => {
	const sort = useStore(s => s.sort)
	const [dateIndex, setDateIndex] = useStore(s => [s.dateIndex, s.setDateIndex])
	return (
		<Wrapper>
			<Field
				type='range'
				min={0}
				max={dates.length - 1}
				value={dateIndex}
				color={getRangeFill(totals[dates[dateIndex]])(sort)}
				onChange={({ target }) => setDateIndex(parseInt(target.value))}
			/>
			{dates.map(x => (
				<Strip
					key={x}
					total={dates.length}
					fill={getRangeFill(totals[x])(sort)}
				/>
			))}
		</Wrapper>
	)
}

export default RangeInput
