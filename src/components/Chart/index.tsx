import React from 'react'
import { LinePath } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { scaleLinear } from '@vx/scale'
import { max } from 'd3-array'
import { ParentSize } from '@vx/responsive'

import useStore from 'store'
import data from 'data/country.json'
import { getColorOf } from 'utils/colorScale'

const dates: DatesEnum[] = data.dates

const x = (v: StateEntry) => dates.findIndex(x => x === v.date)

type ChartProps = {
	width: number
	height: number
	data?: StateEntry[]
	prop?: keyof StateEntry
}

type YType = (v: StateEntry) => number

const Chart = ({ width, height, data, prop = 'nc' }: ChartProps) => {
	const dateIndex = useStore(s => s.dateIndex)
	if (!data || !prop) return null
	const y: YType = v => v[prop]
	// scales
	const xScale = scaleLinear({
		range: [1, width - 1],
		domain: [0, dates.length - 1],
	})
	const yScale = scaleLinear({
		range: [height - 1, 1],
		domain: [0, max(data, y) || 0],
	})

	return (
		<svg width={width} height={height}>
			<LinePath
				data={data.slice(0, dateIndex + 1)}
				x={d => xScale(x(d))}
				y={d => yScale(y(d))}
				stroke={getColorOf(prop)}
				strokeWidth={1}
				curve={curveMonotoneX}
			/>
		</svg>
	)
}

type ResponsiveChartProps = {
	data: StateEntry[]
	prop?: keyof StateEntry
}

const ResponsiveChart = ({ data, prop }: ResponsiveChartProps) => (
	<ParentSize>
		{({ width, height }) => (
			<Chart width={width} height={height} data={data} prop={prop} />
		)}
	</ParentSize>
)

export default ResponsiveChart
