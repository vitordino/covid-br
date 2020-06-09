import React from 'react'
import styled from 'styled-components'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useHistory } from 'react-router-dom'

import useStore from 'store'
import { getMapFill } from 'utils/colorScale'

const geography = '/topo/country.json'

const Wrapper = styled.div`
	position: relative;
`

const MapWithProps = (props?: Record<string, any>) => (
	<ComposableMap
		projectionConfig={{ scale: 550, center: [-54, -13] }}
		height={440}
		style={{ height: 'auto', width: '100%' }}
		width={400}
		projection='geoMercator'
		{...props}
	/>
)

const OverlayMap = styled(MapWithProps)`
	pointer-events: none;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 1;
`

const baseStyle = {
	outline: 'none',
	stroke: 'var(--color-base22)',
	strokeWidth: 0.5,
	cursor: 'pointer',
}

const mapStyle = {
	default: baseStyle,
	hover: baseStyle,
	pressed: baseStyle,
}

const overlayBaseStyle = {
	outline: 'none',
	fill: 'transparent',
	strokeWidth: 4,
}

const overlayMapStyle = {
	default: overlayBaseStyle,
	hover: overlayBaseStyle,
	pressed: overlayBaseStyle,
}

type CountryMapProps = {
	data: StateEntry[]
}

const CountryMap = ({ data }: CountryMapProps) => {
	const { push } = useHistory()
	const sort = useStore(s => s.sort)
	const [hoveredState, setHoveredState] = useStore(s => [
		s.hoveredState,
		s.setHoveredState,
	])
	return (
		<Wrapper>
			<MapWithProps>
				<Geographies geography={geography}>
					{({ geographies }) =>
						geographies.map(geo => (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								style={mapStyle}
								onClick={() => push(`/${geo.id.toLowerCase()}`)}
								fill={getMapFill(data, geo.id)(sort)}
								onMouseEnter={() => setHoveredState(geo.id)}
								onMouseLeave={() => setHoveredState(null)}
							/>
						))
					}
				</Geographies>
			</MapWithProps>
			<OverlayMap>
				<Geographies geography={geography}>
					{({ geographies }) =>
						geographies.map(geo => (
							<Geography
								key={geo.rsmKey}
								geography={geo}
								style={overlayMapStyle}
								stroke={geo.id === hoveredState ? 'yellow' : 'transparent'}
							/>
						))
					}
				</Geographies>
			</OverlayMap>
		</Wrapper>
	)
}

export default CountryMap
