import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { schemeOrRd } from 'd3-scale-chromatic'

import type { StateEntry } from 'components/StatesTable'

import { highestPopCase, highestStateCase } from 'data/states.json'

const geography = '/topo/states.json'

const POP_MULTIPLIER = 100000

const range = (n: number) => Array.from(Array(n).keys())

const getDomain = (entry: number, divisions: number = 8) => [
	1,
	...range(divisions).map(div => ((div + 1) / divisions) * entry),
]
const domains = {
	tc: getDomain(highestStateCase),
	ptc: getDomain(highestPopCase * POP_MULTIPLIER),
}

const multipliers = {
	tc: 1,
	ptc: POP_MULTIPLIER,
}

// @ts-ignore
const colorScale = domain => scaleLinear(domain, schemeOrRd[9])

const mapStyle = {
	default: { outline: 'none' },
	hover: { outline: 'none' },
	pressed: { outline: 'none' },
}

type PropUnion = keyof typeof domains & keyof typeof multipliers

const getFill = (data: StateEntry[], id: string) => (prop: PropUnion) => {
	const x = data.find(({ st }) => st === id)?.[prop]
	if (typeof x !== 'number') return '#eee'
	return colorScale(domains[prop])(x * multipliers[prop])
}

type StatesMapProps = {
	data: StateEntry[]
	scaleProp?: PropUnion
}

const StatesMap = ({ data, scaleProp = 'ptc' }: StatesMapProps) => (
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
						fill={getFill(data, geo.id)(scaleProp)}
					/>
				))
			}
		</Geographies>
	</ComposableMap>
)

export default StatesMap
