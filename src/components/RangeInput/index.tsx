import React from 'react'

type RangeInputProps = {
	value: number
	onChange: (value: number) => void
	dates: string[]
}

const RangeInput = ({ value, onChange, dates }: RangeInputProps) => (
	<input
		type='range'
		min={0}
		max={dates.length - 1}
		value={value}
		onChange={({ target }) => onChange(parseInt(target.value))}
		style={{
			width: '100%',
			position: 'sticky',
			top: 0,
			background: 'red',
			zIndex: 10,
		}}
	/>
)

export default RangeInput
