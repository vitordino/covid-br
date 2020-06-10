import React from 'react'
import { LinePath } from '@vx/shape'
import { curveMonotoneX } from '@vx/curve'
import { scaleLinear } from '@vx/scale'
import { max } from 'd3-array'
import { ParentSize } from '@vx/responsive'

import useStore from 'store'
import { getColorOf } from 'utils/colorScale'

type ChartProps = {
	dates: string[]
	data: EntryArrayUnion
	prop: keyof EntryUnion
}

type AxisFn = (v: EntryUnion) => string | number | null

const dateStringToNumber = (s: string) => +s.replace(/-/g, '')
const isBefore = (a: string, b: string) =>
	dateStringToNumber(a) < dateStringToNumber(b)

const Chart = ({ data, dates, prop }: ChartProps) => {
	const dateIndex = useStore(s => s.dateIndex)
	const x: AxisFn = v => dates.findIndex(x => x === v.date)
	const y: AxisFn = v => v?.[prop]
	const xScale = (width: number) =>
		scaleLinear({
			range: [1, width - 1],
			domain: [0, dates.length - 1],
		})
	const yScale = (height: number) =>
		scaleLinear({
			range: [height - 1, 1],
			// @ts-ignore
			domain: [0, max(data, y) || 0],
		})

	return (
		<ParentSize>
			{({ width, height }) => (
				<svg width={width} height={height}>
					<LinePath
						data={data.filter(({ date }) => isBefore(date, dates[dateIndex]))}
						// @ts-ignore
						x={d => xScale(width)(x(d))}
						// @ts-ignore
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
