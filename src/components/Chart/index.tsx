// @ts-nocheck
import React, { ReactNode } from 'react'
import { LinePath } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { scaleLinear } from '@vx/scale'
import { max } from 'd3-array'
import { ParentSize } from '@vx/responsive'

import useStore from 'store'
import { getColorOf } from 'utils/colorScale'

type ChartProps<T> = {
	dates: DatesEnum[]
	data: T[]
	prop: keyof T
}

type ChartType = {
	<T extends object>(props: ChartProps<T>): ReactNode
}

type AxisFn<T> = (v: T) => number

const Chart: ChartType = ({ data, dates, prop }) => {
	const dateIndex = useStore(s => s.dateIndex)
	const x: AxisFn = v => dates.findIndex(x => x === v.date)
	const y: AxisFn = v => v[prop]
	const xScale = (width: number) =>
		scaleLinear({
			range: [1, width - 1],
			domain: [0, dates.length - 1],
		})
	const yScale = (height: number) =>
		scaleLinear({
			range: [height - 1, 1],
			domain: [0, max(data, y) || 0],
		})

	return (
		<ParentSize>
			{({ width, height }) => (
				<svg width={width} height={height}>
					<LinePath
						data={data.slice(0, dateIndex + 1)}
						x={d => xScale(width)(x(d))}
						y={d => yScale(height)(y(d))}
						stroke={getColorOf(prop)}
						strokeWidth={1.75}
						curve={curveMonotoneX}
					/>
				</svg>
			)}
		</ParentSize>
	)
}

export default Chart
