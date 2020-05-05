import React, { ReactNode } from 'react'
import styled from 'styled-components'

import useStore from 'store'
import Text from 'components/Text'
import Spacer from 'components/Spacer'

const Wrapper = styled.div``

type StatsCardProps = {
	prop: keyof StateEntry
	data: StateEntry
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

const StatsCard = ({ prop, data, ...props }: StatsCardProps) => {
	const sort = useStore(s => s.sort)
	const isSorted = sort === prop
	const { main, mainAlt, sub, subAlt } = dataMappingsBySort?.[prop] || {}

	return (
		<Wrapper {...props}>
			{main && (
				<Text weight={600} transform='capitalize' xs={0}>
					{typeMapping[main]?.scope}
				</Text>
			)}
			<Spacer.V xs={0.25} />
			<Text xs={2}>
				{!!main && <Render bold value={data?.[main]} {...typeMapping[main]} />}
				{!!main && !!mainAlt && ' '}
				{!!mainAlt && (
					<Render value={data?.[mainAlt]} {...typeMapping[mainAlt]} />
				)}
			</Text>
			<Spacer.V xs={0.125} />
			<Text xs={0}>
				{!!sub && <Render bold value={data?.[sub]} {...typeMapping[sub]} />}
				{!!sub && !!subAlt && ' '}
				{!!subAlt && <Render value={data?.[subAlt]} {...typeMapping[subAlt]} />}
			</Text>
			{JSON.stringify({ isSorted })}
		</Wrapper>
	)
}

export default StatsCard
