import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

import type { StateEntry } from 'App'
import { getMapFill } from 'utils/colorScale'
import type { PropUnion } from 'utils/colorScale'

const geography = '/topo/states.json'

const mapStyle = {
	default: { outline: 'none' },
	hover: { outline: 'none' },
	pressed: { outline: 'none' },
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
						fill={getMapFill(data, geo.id)(scaleProp)}
					/>
				))
			}
		</Geographies>
	</ComposableMap>
)

export default StatesMap
