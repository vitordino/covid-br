// @ts-nocheck
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'

import range from 'utils/range'
import type { Transform } from 'components/Text'
import Text from 'components/Text'

export type RowProps = {
	values: StateEntry
	index: number
}

export type CellProps = {
	row: RowProps
	column: { id: keyof StateEntry | keyof CityEntry }
	data: StateEntry[] | CityEntry[]
	[key: string]: any
}

type HeaderProps = {
	children?: ReactNode
	column: {
		isSorted: boolean
		isSortedDesc: boolean
	}
	[key: string]: any
	isVisible: boolean
}

type StaticCellProps = {
	left?: ReactNode
	children?: ReactNode
	bold?: boolean
	transform?: Transform
	to?: string
}

export const CellWrapper = styled(Text)`
	padding: 0.375rem 0.75rem;
	display: flex;
	position: relative;
	align-items: baseline;
	& > * {
		flex: 1;
	}
`

export const Left = styled(Text)`
	display: none;
	${p => p.theme.above('md')`
		display: block;
	`}
`

export const Cell = ({
	left,
	children,
	transform,
	bold = true,
	to,
}: StaticCellProps) => (
	// @ts-ignore
	<CellWrapper as={to ? Link : null} to={to} transform={transform}>
		{!!left && <Left>{left}</Left>}
		{!!left && '\t'}
		{bold && <strong>{children || <br />}</strong>}
		{!bold && <div>{children || <br />}</div>}
	</CellWrapper>
)

type DynamicCellProps = {
	row: RowProps
	data?: StateEntry[] | CityEntry[]
	column: { id: keyof StateEntry | keyof CityEntry }
	prop?: keyof StateEntry | keyof CityEntry
	leftProp?: keyof StateEntry | keyof CityEntry
	leftRender?: (x: ReactNode) => ReactNode
	mainRender?: (x: ReactNode) => ReactNode
	children?: ReactNode
	isVisible: boolean
	to?: string
}

export const DynamicCell = ({
	row,
	column,
	data,
	prop,
	leftProp,
	leftRender = x => `+${x}`,
	mainRender = x => x,
	children,
	isVisible = true,
	to,
}: DynamicCellProps) => {
	if (!isVisible) return null
	return (
		<Cell to={to} left={leftProp && leftRender(data?.[row.index]?.[leftProp])}>
			{children || mainRender(row.values?.[prop || column.id])}
		</Cell>
	)
}

export const HeaderWrapper = styled(Text)`
	display: flex;
	justify-content: space-between;
	padding: 0.5rem 0.75rem;
	border-radius: 0 0 0.25rem 0.25rem;
	background: var(--color-base06);
	color: var(--color-base66);
	box-shadow: 0 0 0 0.25rem var(--color-base00);
	margin-bottom: 0.25rem;
	${p => p.theme.above('md')`
		border-radius: 0.25rem;
	`}
	&:hover {
		background: var(--color-base);
		color: var(--color-base00);
	}
`

export const Header = ({ children, column, isVisible }: HeaderProps) => {
	if (!isVisible) return null
	return (
		<HeaderWrapper>
			<strong>{children}</strong>{' '}
			<span>{column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '·'}</span>
		</HeaderWrapper>
	)
}

export const TotalRow = styled.tr`
	td {
		background: transparent !important;
		position: sticky;
		bottom: 0.5rem;
		padding-top: 0.5rem;
	}
	& > * > * {
		background: var(--color-base00);
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		border-top: 1px solid var(--color-base11);
		margin-top: 0.125rem;
		/* box-shadow: 0 -0.5rem 1rem var(--color-base00); */
	}
`

export const Wrapper = styled.div`
	padding: 0 0.125rem;
`

// prettier-ignore
export const Table = styled.table`
	width: 100%;
	text-align: right;
	margin: 0 -0.25rem;
	position: relative;
	th:first-child,
	td:first-child {
		text-align: left;
	}
	th {
		position: sticky;
		top: 2.75rem;
		z-index: 1;
		${p => p.theme.above('md')`
			top: 0.25rem;
		`}
		&:nth-child(1) { z-index: 8 }
		&:nth-child(2) { z-index: 7 }
		&:nth-child(3) { z-index: 6 }
		&:nth-child(4) { z-index: 5 }
		&:nth-child(5) { z-index: 4 }
		&:nth-child(6) { z-index: 3 }
		&:nth-child(7) { z-index: 2 }
		&:nth-child(8) { z-index: 1 }
	}
	tr:nth-child(2n) > * {
		background: var(--color-base03);
	}
`

export const Mobile = styled.span`
	${p => p.theme.above('md')`
		display: none;
	`}
`
export const Desktop = styled.span`
	display: none;
	${p => p.theme.above('md')`
		display: initial;
	`}
`

type TableRowProps = { active: boolean }

export const activeStyle = css`
	& > * {
		background: yellow !important;
		color: ${p => p.theme.colors.light.base};
	}
`

export const TableRow = styled.tr<TableRowProps>`
	&:hover {
		${activeStyle}
	}
	${p => p.active && activeStyle}
`

type SortByOptions = {
	id: keyof StateEntry | keyof CityEntry
	desc: boolean
}

type InitialTableState = {
	sortBy: SortByOptions[]
}

export const initialState: InitialTableState = {
	sortBy: [{ id: 'tc', desc: true }],
}

export const RelativeRender = ({
	x,
	isNew,
}: {
	x: number
	isNew?: boolean
}) => (
	<span title={`${isNew ? '+ ' : ''}${x * 10000} a cada 10 mil hab`}>
		{!!isNew && x > 0 && '+ '}
		{(x * 10000).toFixed(2)}‱
	</span>
)

export const AbsoluteRender = ({
	x,
	isNew,
}: {
	x: number
	isNew?: boolean
}) => (
	<span>
		{!!isNew && x > 0 && '+ '}
		{x}
	</span>
)

export const getCellRender = (relative: boolean, isNew?: boolean) => (
	x: ReactNode,
) => {
	if (typeof x !== 'number') return x
	if (relative) return <RelativeRender x={x} isNew={isNew} />
	return <AbsoluteRender x={x} isNew={isNew} />
}

type EmptyCellsProps = {
	count: number
	isVisible?: boolean
}

export const EmptyCells = ({ count, isVisible = true }: EmptyCellsProps) => {
	if (!isVisible) return null
	return (
		<>
			{range(count).map(x => (
				<td key={x} />
			))}
		</>
	)
}
