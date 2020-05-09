import React, { ReactNode } from 'react'
import styled from 'styled-components'

import useStore from 'store'
import { getColorOf } from 'utils/colorScale'
import Text from 'components/Text'
import Spacer from 'components/Spacer'
import Chart from 'components/Chart'

type WrapperProps = {
	prop: keyof StateEntry
	isSorted: boolean
}

const Wrapper = styled.button<WrapperProps>`
	display: block;
	width: 100%;
	cursor: pointer;
	padding: 0.25rem 1rem 0.75rem;
	position: relative;
	margin: 1rem 1rem 1rem 0;
	${p => p.theme.above('md')`
		margin: 1rem 0;
	`}
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 2px;
		background: ${({ prop }) => getColorOf(prop)};
	}
	&:after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		height: 0.75rem;
		background: ${({ prop }) => getColorOf(prop)};
		transform: rotate(-35deg);
		transform-origin: top right;
		opacity: ${p => (p.isSorted ? 1 : 0)};
	}
`

const ChartContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
`

const Content = styled.div`
	position: relative;
`

const FlexText = styled(Text)`
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	text-align: right;
	flex-direction: row-reverse;
	span {
		color: var(--color-base44);
	}
`

type StatsCardProps = {
	prop: keyof StateEntry
	data?: StateEntry
	chartData?: StateEntry[]
}

type DataMappingOf<T> = {
	main: keyof T
	mainAlt: keyof T
	sub: keyof T
	subAlt: keyof T
}

type DataMappingsOf<T> = {
	[K in keyof T]?: DataMappingOf<T>
}

const dataMappingsBySort: DataMappingsOf<StateEntry> = {
	tc: { main: 'tc', mainAlt: 'nc', sub: 'ptc', subAlt: 'pnc' },
	td: { main: 'td', mainAlt: 'nd', sub: 'ptd', subAlt: 'pnd' },
	tr: { main: 'tr', mainAlt: 'nr', sub: 'ptr', subAlt: 'pnr' },
	ptc: { main: 'ptc', mainAlt: 'pnc', sub: 'tc', subAlt: 'nc' },
	ptd: { main: 'ptd', mainAlt: 'pnd', sub: 'td', subAlt: 'nd' },
	ptr: { main: 'ptr', mainAlt: 'pnr', sub: 'tr', subAlt: 'nr' },
}

enum Scopes {
	confirmed,
	deaths,
	recovered,
}

enum Kinds {
	absolute,
	relative,
}

type TypeMap = {
	scope: keyof typeof Scopes
	isNew: boolean
	kind: keyof typeof Kinds
}

type TypeMappings = {
	[K in keyof StateEntry]?: TypeMap
}

const typeMapping: TypeMappings = {
	tc: { scope: 'confirmed', isNew: false, kind: 'absolute' },
	nc: { scope: 'confirmed', isNew: true, kind: 'absolute' },
	ptc: { scope: 'confirmed', isNew: false, kind: 'relative' },
	pnc: { scope: 'confirmed', isNew: true, kind: 'relative' },
	td: { scope: 'deaths', isNew: false, kind: 'absolute' },
	nd: { scope: 'deaths', isNew: true, kind: 'absolute' },
	ptd: { scope: 'deaths', isNew: false, kind: 'relative' },
	pnd: { scope: 'deaths', isNew: true, kind: 'relative' },
	tr: { scope: 'recovered', isNew: false, kind: 'absolute' },
	nr: { scope: 'recovered', isNew: true, kind: 'absolute' },
	ptr: { scope: 'recovered', isNew: false, kind: 'relative' },
	pnr: { scope: 'recovered', isNew: true, kind: 'relative' },
}

type RenderValueProps = {
	value: number | ReactNode
	isNew?: boolean
	kind?: keyof typeof Kinds
}

const MULTIPLIER = 10000

const RenderValue = ({ value, isNew, kind }: RenderValueProps) => {
	if (typeof value !== 'number') return <>{value}</>
	if (kind === 'relative')
		return (
			<>
				{isNew && value > 0 ? '+ ' : ''}
				{(value * MULTIPLIER).toFixed(2)}‱
			</>
		)
	return (
		<>
			{isNew && value > 0 ? '+ ' : ''}
			{value}
		</>
	)
}

type RenderProps = {
	value: number | ReactNode
	isNew?: boolean
	kind?: keyof typeof Kinds
	bold?: boolean
}

const Render = ({ bold, ...props }: RenderProps) => {
	if (bold)
		return (
			<strong>
				<RenderValue {...props} />
			</strong>
		)
	return (
		<span>
			<RenderValue {...props} />
		</span>
	)
}

const StatsCard = ({ prop, data, chartData }: StatsCardProps) => {
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])
	const isSorted = sort === prop
	const { main, mainAlt, sub, subAlt } = dataMappingsBySort?.[prop] || {}

	if (!main || !data?.[main]) return null

	return (
		<Wrapper prop={prop} isSorted={isSorted} onClick={() => setSort(prop)}>
			<ChartContainer>
				{chartData && <Chart prop={prop} data={chartData} />}
			</ChartContainer>
			<Content>
				{main && (
					<FlexText weight={600} transform='capitalize' xs={0}>
						{typeMapping[main]?.scope}
					</FlexText>
				)}
				<Spacer.V xs={0.125} />
				<FlexText xs={2}>
					{!!main && (
						<Render bold value={data?.[main]} {...typeMapping[main]} />
					)}
					{!!main && !!mainAlt && ' '}
					{!!mainAlt && (
						<Render value={data?.[mainAlt]} {...typeMapping[mainAlt]} />
					)}
				</FlexText>
				<Spacer.V xs={0.125} />
				<FlexText xs={0}>
					{!!sub && <Render bold value={data?.[sub]} {...typeMapping[sub]} />}
					{!!sub && !!subAlt && ' '}
					{!!subAlt && (
						<Render value={data?.[subAlt]} {...typeMapping[subAlt]} />
					)}
				</FlexText>
			</Content>
		</Wrapper>
	)
}

export default StatsCard
