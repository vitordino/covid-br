import React from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

import useStore from 'store'
import { getMapFill } from 'utils/colorScale'

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

type CountryMapProps = {
	data?: StateEntry[]
	id?: string
}

const CountryMap = ({ data = [], id = 'country', }: CountryMapProps) => {
	const sort = useStore(s => s.sort)
	const [hoveredState, setHoveredState] = useStore(s => [
		s.hoveredState,
		s.setHoveredState,
	])
	const geography = `/topo/${id}.json`
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
									: getMapFill(data, geo.id)(sort)
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

export default CountryMap
