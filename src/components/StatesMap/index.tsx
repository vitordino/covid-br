import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

import useStore from 'store'
import { getMapFill } from 'utils/colorScale'
import type { PropUnion } from 'utils/colorScale'

const geography = '/topo/states.json'

const baseStyle = {
	outline: 'none',
	stroke: 'var(--color-base22)',
	strokeWidth: 0.5,
}

const mapStyle = {
	default: baseStyle,
	hover: baseStyle,
	pressed: baseStyle,
}

type StatesMapProps = {
	data: StateEntry[]
	scaleProp?: PropUnion
}

const StatesMap = ({ data, scaleProp = 'ptc' }: StatesMapProps) => {
	const [hoveredState, setHoveredState] = useStore(s => [
		s.hoveredState,
		s.setHoveredState,
	])
	return (
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
							fill={
								geo.id === hoveredState
									? 'yellow'
									: getMapFill(data, geo.id)(scaleProp)
							}
							onMouseEnter={() => setHoveredState(geo.id)}
							onMouseLeave={() => setHoveredState(null)}
						/>
					))
				}
			</Geographies>
		</ComposableMap>
	)
}

export default StatesMap
