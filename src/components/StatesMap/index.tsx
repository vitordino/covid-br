import React, { ReactNode, SetStateAction, Dispatch } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

import { getMapFill } from 'utils/colorScale'
import type { PropUnion } from 'utils/colorScale'
import type { StateEntry } from 'components/StatesTable'

const geography = '/topo/states.json'

const mapStyle = {
	default: { outline: 'none' },
	hover: { outline: 'none' },
	pressed: { outline: 'none' },
}

type StatesMapProps = {
	data: StateEntry[]
	scaleProp?: PropUnion
	setTooltipContent: Dispatch<SetStateAction<ReactNode>>
}

const StatesMap = ({
	data,
	scaleProp = 'ptc',
	setTooltipContent,
}: StatesMapProps) => (
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
						onMouseEnter={() => setTooltipContent(() => <div>{geo.id}</div>)}
						onMouseLeave={() => setTooltipContent('')}
					/>
				))
			}
		</Geographies>
	</ComposableMap>
)

export default StatesMap
