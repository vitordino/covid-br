import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { schemeOrRd } from 'd3-scale-chromatic'

import type { StateEntry } from '../StatesTable'

import data from '../../data/states.json'

const geography = '/topo/states.json'

const range = (n: number) => Array.from(Array(n).keys())

const getDomain = (divisions: number) => (entry: number) => [
	1,
	...range(divisions).map(div => ((div + 1) / divisions) * entry),
]

const domain = getDomain(8)(data.highestStateCase)

// @ts-ignore
const colorScale = scaleLinear(domain, schemeOrRd[9])

const mapStyle = {
	default: { outline: 'none' },
	hover: { outline: 'none' },
	pressed: { outline: 'none' },
}

const getFill = (data: StateEntry[], id: string) => {
	const { tc } = data.find(({ st }) => st === id) || { tc: '0' }
	if (tc === '0') return '#eee'
	return colorScale(tc)
}

type StatesMapProps = {
	data: StateEntry[]
}

const StatesMap = ({ data }: StatesMapProps) => (
	<ComposableMap
		data-tip=''
		projectionConfig={{ scale: 550, center: [-54, -13] }}
		height={440}
		style={{ height: 'auto', width: '100%' }}
		width={400}
		projection='geoMercator'
	>
		<Geographies geography={geography}>
			{({ geographies }) =>
				geographies.map(geo => (
					<Geography
						key={geo.rsmKey}
						geography={geo}
						style={mapStyle}
						fill={getFill(data, geo.id)}
					/>
				))
			}
		</Geographies>
	</ComposableMap>
)

export default StatesMap
