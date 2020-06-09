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

// prettier-ignore
const Wrapper = styled.button<WrapperProps>`
	display: block;
	width: 100%;
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
	${p => p.isSorted && `
		cursor: default;
	`}
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

type StatsCardProps<T> = {
	prop: keyof T
	dates: DatesEnum[]
	data?: T
	chartData?: T[]
}

type StatsCardType = {
	<T extends object>(props: StatsCardProps<T>): ReactNode
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

const dataMappingsBySort = {
	tc: { main: 'tc', mainAlt: 'nc', sub: 'ptc', subAlt: 'pnc' },
	td: { main: 'td', mainAlt: 'nd', sub: 'ptd', subAlt: 'pnd' },
	tr: { main: 'tr', mainAlt: 'nr', sub: 'ptr', subAlt: 'pnr' },
	ptc: { main: 'ptc', mainAlt: 'pnc', sub: 'tc', subAlt: 'nc' },
	ptd: { main: 'ptd', mainAlt: 'pnd', sub: 'td', subAlt: 'nd' },
	ptr: { main: 'ptr', mainAlt: 'pnr', sub: 'tr', subAlt: 'nr' },
} as const

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
	tc: { scope: 'confirmados', isNew: false, kind: 'absolute' },
	nc: { scope: 'confirmados', isNew: true, kind: 'absolute' },
	ptc: { scope: 'confirmados', isNew: false, kind: 'relative' },
	pnc: { scope: 'confirmados', isNew: true, kind: 'relative' },
	td: { scope: 'óbitos', isNew: false, kind: 'absolute' },
	nd: { scope: 'óbitos', isNew: true, kind: 'absolute' },
	ptd: { scope: 'óbitos', isNew: false, kind: 'relative' },
	pnd: { scope: 'óbitos', isNew: true, kind: 'relative' },
	tr: { scope: 'recuperados', isNew: false, kind: 'absolute' },
	nr: { scope: 'recuperados', isNew: true, kind: 'absolute' },
	ptr: { scope: 'recuperados', isNew: false, kind: 'relative' },
	pnr: { scope: 'recuperados', isNew: true, kind: 'relative' },
}

type RenderValueProps = {
	value: number | ReactNode
	isNew?: boolean
	kind?: keyof typeof Kinds
}

const MULTIPLIER = 10000

const RenderValue = ({ value, isNew, kind }: RenderValueProps) => {
	if (!value) return <br />
	if (!isFinite(value)) return <>{value}</>
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

const StatsCard: StatsCardType = ({ prop, data, dates, chartData }) => {
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])
	const isSorted = sort === prop
	const { main, mainAlt, sub, subAlt } = dataMappingsBySort?.[prop] || {}

	if (!main || !data) return null

	return (
		<Wrapper prop={prop} isSorted={isSorted} onClick={() => setSort(prop)}>
			<ChartContainer>
				{!!dates && !!prop && !!chartData && (
					<Chart dates={dates} prop={prop} data={chartData} />
				)}
			</ChartContainer>
			<Content>
				{main && (
					<FlexText weight={600} transform='capitalize' xs={0}>
						{typeMapping[main]?.scope}
					</FlexText>
				)}
				<Spacer.V xs={0.125} />
				<FlexText xs={2}>
					<Render bold value={data?.[main]} {...typeMapping[main]} />
					{!!main && !!mainAlt && ' '}
					<Render value={data?.[mainAlt]} {...typeMapping[mainAlt]} />
				</FlexText>
				<Spacer.V xs={0.125} />
				<FlexText xs={0}>
					<Render bold value={data?.[sub]} {...typeMapping[sub]} />
					{!!sub && !!subAlt && ' '}
					<Render value={data?.[subAlt]} {...typeMapping[subAlt]} />
				</FlexText>
			</Content>
		</Wrapper>
	)
}

export default StatsCard
