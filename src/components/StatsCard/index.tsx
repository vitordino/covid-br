import React, { ReactNode } from 'react'
import styled from 'styled-components'

import useStore from 'store'

const Wrapper = styled.div``

type StatsCardProps = {
	hoveredData?: StateEntry
	label?: ReactNode
	main?: ReactNode
	mainAlt?: ReactNode
	sub?: ReactNode
	subAlt?: ReactNode
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
	ptc: { main: 'ptc', mainAlt: 'pnc', sub: 'tc', subAlt: 'nc' },
	td: { main: 'td', mainAlt: 'nd', sub: 'ptd', subAlt: 'pnd' },
	ptd: { main: 'ptd', mainAlt: 'pnd', sub: 'td', subAlt: 'nd' },
	tr: { main: 'tr', mainAlt: 'nr', sub: 'ptr', subAlt: 'pnr' },
	ptr: { main: 'ptr', mainAlt: 'pnr', sub: 'tr', subAlt: 'nr' },
}

enum Scopes {
	confirmed,
	death,
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
	td: { scope: 'death', isNew: false, kind: 'absolute' },
	nd: { scope: 'death', isNew: true, kind: 'absolute' },
	ptd: { scope: 'death', isNew: false, kind: 'relative' },
	pnd: { scope: 'death', isNew: true, kind: 'relative' },
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
				{isNew ? '+ ' : ''}
				{(value * MULTIPLIER).toFixed(2)}‱
			</>
		)
	return (
		<>
			{isNew ? '+ ' : ''}
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

const StatsCard = ({ label, hoveredData, ...props }: StatsCardProps) => {
	const sort = useStore(s => s.sort)
	const { main, mainAlt, sub, subAlt } = dataMappingsBySort?.[sort] || {}

	return (
		<Wrapper {...props}>
			{main && <div>{typeMapping[main]?.scope}</div>}
			<div>
				{!!main && (
					<Render bold value={hoveredData?.[main]} {...typeMapping[main]} />
				)}
				{!!main && !!mainAlt && ' '}
				{!!mainAlt && (
					<Render value={hoveredData?.[mainAlt]} {...typeMapping[mainAlt]} />
				)}
			</div>
			<div>
				{!!sub && (
					<Render bold value={hoveredData?.[sub]} {...typeMapping[sub]} />
				)}
				{!!sub && !!subAlt && ' '}
				{!!subAlt && (
					<Render value={hoveredData?.[subAlt]} {...typeMapping[subAlt]} />
				)}
			</div>
		</Wrapper>
	)
}

export default StatsCard
