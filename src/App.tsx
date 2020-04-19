import React, { useState, useMemo } from 'react'
import {
	ComposableMap,
	Geographies,
	Geography,
	ZoomableGroup,
} from 'react-simple-maps'

import BaseTrend from './components/Trend'
import StatesTable from './components/StatesTable'
import Container from './components/Container'
import Grid from './components/Grid'
import Layout from './components/Layout'

import type { StateEntry, StateEntries } from './components/StatesTable'

import data from './data/states.json'

const geography = '/topo/states.json'

const Trend = (props: any) => (
	<BaseTrend
		smooth
		autoDraw
		autoDrawEasing='ease-out'
		gradient={['#00c6ff', '#F0F', '#FF0']}
		radius={5}
		strokeWidth={2}
		strokeLinecap={'round'}
		{...props}
	/>
)

export type Main = {
	[key: string]: StateEntry[]
}

const main: Main = data.main
const dates: string[] = data.dates

const removeTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st !== 'TOTAL')

const findTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st === 'TOTAL')[0]

const identity = (x: any) => x
const x = Object.values(main)
	.flatMap(identity)
	.filter(({ st }) => st === 'TOTAL')
	.map((x) => parseInt(x.tc))

type Coords = [number, number]

type MapConstraints = {
	zoom: number
	lat: number
	long: number
	coords: Coords
}

const mapConstraints: MapConstraints = {
	zoom: 1,
	lat: -54,
	long: -14,
	coords: [-54, -14],
}

const mapStyle = {
	default: {
		fill: '#D6D6DA',
		outline: 'none',
	},
	hover: {
		fill: '#E42',
		outline: 'none',
	},
	pressed: {
		fill: '#E42',
		outline: 'none',
	},
}

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const data: StateEntries = useMemo(() => removeTotal(main[dates[index]]), [
		index,
	])
	const total: StateEntry = useMemo(() => findTotal(main[dates[index]]), [
		index,
	])

	return (
		<Layout>
			<Container>
				<Grid.Row vertical-gutter>
					<Grid.Column xs={16} lg={8}>
						<input
							type='range'
							min='0'
							max={dates.length - 1}
							value={index}
							onChange={({ target }) => setIndex(parseInt(target.value))}
						/>
						<pre>{dates[index]}</pre>
						<Trend data={x} />
						<StatesTable data={data} total={total} />
					</Grid.Column>
					<Grid.Column xs={16} lg={8}>
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
									geographies.map((geo) => (
										<Geography
											key={geo.rsmKey}
											geography={geo}
											style={mapStyle}
										/>
									))
								}
							</Geographies>
						</ComposableMap>
					</Grid.Column>
				</Grid.Row>
			</Container>
		</Layout>
	)
}

export default App
