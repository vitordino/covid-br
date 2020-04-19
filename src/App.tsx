import React, { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'
import { schemeOrRd } from 'd3-scale-chromatic'

import BaseTrend from './components/Trend'
import StatesTable from './components/StatesTable'
import Container from './components/Container'
import Grid from './components/Grid'
import Layout from './components/Layout'

import type { StateEntry, StateEntries } from './components/StatesTable'

import data from './data/states.json'

const geography = '/topo/states.json'

export type Main = {
	[key: string]: StateEntry[]
}

const main: Main = data.main
const dates: string[] = data.dates

const highestCase = Object.values(main)
	.flatMap((x) => x)
	.filter((x) => x.st !== 'TOTAL')
	.map((x) => parseInt(x.tc))
	.reduce((a: number, b: number) => (a > b ? a : b), 0)

// @ts-ignore
const colorScale = scaleLinear([1, highestCase / 12], schemeOrRd[9])

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

const removeTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st !== 'TOTAL')

const findTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st === 'TOTAL')[0]

const identity = (x: any) => x
const trendData = Object.values(main)
	.flatMap(identity)
	.filter(({ st }) => st === 'TOTAL')
	.map((x) => parseInt(x.tc))

const mapStyle = {
	default: { outline: 'none' },
	hover: { outline: 'none' },
	pressed: { outline: 'none' },
}

const getFill = (data: StateEntries, id: string) => {
	const { tc } = data.find(({ st }) => st === id) || { tc: '0' }
	if (tc === '0') return '#eee'
	return colorScale(parseInt(tc))
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
						<Trend data={trendData} />
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
											fill={getFill(data, geo.id)}
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
