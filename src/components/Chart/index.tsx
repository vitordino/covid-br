import React from 'react'
import { LinePath } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { scaleLinear } from '@vx/scale'
import { max } from 'd3-array'
import { ParentSize } from '@vx/responsive'

import useStore from 'store'
import { getColorOf } from 'utils/colorScale'

type ChartProps = {
	width: number
	height: number
	dates: DatesEnum[]
	data?: StateEntry[]
	prop?: keyof StateEntry
}

type AxisFn = (v: StateEntry) => number

const Chart = ({ width, height, data, dates, prop = 'nc' }: ChartProps) => {
	const dateIndex = useStore(s => s.dateIndex)
	if (!data || !prop) return null
	const x: AxisFn = v => dates.findIndex(x => x === v.date)
	const y: AxisFn = v => v[prop]
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
				strokeWidth={1.75}
				curve={curveMonotoneX}
			/>
		</svg>
	)
}

type ResponsiveChartProps = {
	data: StateEntry[]
	dates: DatesEnum[]
	prop?: keyof StateEntry
}

const ResponsiveChart = (props: ResponsiveChartProps) => (
	<ParentSize>
		{({ width, height }) => <Chart width={width} height={height} {...props} />}
	</ParentSize>
)

export default ResponsiveChart
