import React, { ReactNode, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useTable, useSortBy, Column } from 'react-table'

import type { Transform } from 'components/Text'
import useStore from 'store'
import Text from 'components/Text'

type RowProps = {
	values: StateEntry
	index: number
}

type Cell = {
	row: RowProps
	column: { id: keyof StateEntry }
	data: StateEntry[]
	[key: string]: any
}

type Header = any

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
}

const CellWrapper = styled(Text)`
	padding: 0.375rem 0.75rem;
	display: flex;
	position: relative;
	align-items: baseline;
	& > * {
		flex: 1;
	}
`

const Left = styled(Text)`
	display: none;
	${p => p.theme.above('sm')`
		display: block;
	`}
`

const Cell = ({ left, children, transform, bold = true }: StaticCellProps) => (
	<CellWrapper transform={transform}>
		{!!left && <Left>{left}</Left>}
		{!!left && '\t'}
		{bold && <strong>{children}</strong>}
		{!bold && <div>{children}</div>}
	</CellWrapper>
)

type DynamicCellProps = {
	row: RowProps
	data?: StateEntry[]
	column: { id: keyof StateEntry }
	prop?: keyof StateEntry
	leftProp?: keyof StateEntry
	leftRender?: (x: ReactNode) => ReactNode
	mainRender?: (x: ReactNode) => ReactNode
	children?: ReactNode
	isVisible: boolean
}

const DynamicCell = ({
	row,
	column,
	data,
	prop,
	leftProp,
	leftRender = x => `+${x}`,
	mainRender = x => x,
	children,
	isVisible,
}: DynamicCellProps) => {
	if (!isVisible) return null
	return (
		<Cell left={leftProp && leftRender(data?.[row.index]?.[leftProp])}>
			{children || mainRender(row.values?.[prop || column.id])}
		</Cell>
	)
}

const HeaderWrapper = styled(Text)`
	display: flex;
	justify-content: space-between;
	padding: 0.5rem 0.75rem;
	border-radius: 0.25rem;
	background: var(--color-base06);
	color: var(--color-base66);
	box-shadow: 0 0 0 0.25rem var(--color-base00);
	margin-bottom: 0.25rem;
	&:hover {
		background: var(--color-base);
		color: var(--color-base00);
	}
`

const Header = ({ children, column, isVisible }: HeaderProps) => {
	if (!isVisible) return null
	return (
		<HeaderWrapper>
			<strong>{children}</strong>{' '}
			<span>{column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '·'}</span>
		</HeaderWrapper>
	)
}

const TotalRow = styled.tr`
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

const Wrapper = styled.div`
	padding: 0 0.125rem;
`

const Table = styled.table`
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
		top: 0.25rem;
		z-index: 1;
		&:nth-child(1) {
			z-index: 3;
		}
		&:nth-child(2) {
			z-index: 2;
		}
	}
	tr:nth-child(2n) > * {
		background: var(--color-base03);
	}
`

const Mobile = styled.span`
	${p => p.theme.above('md')`
		display: none;
	`}
`
const Desktop = styled.span`
	display: none;
	${p => p.theme.above('md')`
		display: inline;
	`}
`

type TableRowProps = { active: boolean }

const activeStyle = css`
	& > * {
		background: yellow !important;
		color: ${p => p.theme.colors.light.base};
	}
`

const TableRow = styled.tr<TableRowProps>`
	&:hover {
		${activeStyle}
	}
	${p => p.active && activeStyle}
`

type StateMeta = {
	p: number
	n: string
}

type StatesTableProps = {
	data: StateEntry[]
	total: StateEntry
	statesMeta: StatesMeta
}

type SortByOptions = {
	id: keyof StateEntry
	desc: boolean
}

type InitialTableState = {
	sortBy: SortByOptions[]
}

const initialState: InitialTableState = {
	sortBy: [{ id: 'tc', desc: true }],
}

const RelativeRender = ({ x, isNew }: { x: number; isNew?: boolean }) => (
	<span title={`${isNew ? '+ ' : ''}${x * 10000} a cada 10 mil hab`}>
		{!!isNew && x > 0 && '+ '}
		{(x * 10000).toFixed(2)}‱
	</span>
)

const AbsoluteRender = ({ x, isNew }: { x: number; isNew?: boolean }) => (
	<span>
		{!!isNew && x > 0 && '+ '}
		{x}
	</span>
)

const getCellRender = (relative: boolean, isNew?: boolean) => (
	x: ReactNode,
) => {
	if (typeof x !== 'number') return x
	if (relative) return <RelativeRender x={x} isNew={isNew} />
	return <AbsoluteRender x={x} isNew={isNew} />
}

const StatesTable = ({ data, total, statesMeta }: StatesTableProps) => {
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])
	const relative = useStore(s => s.relative)
	const [hoveredState, setHoveredState] = useStore(s => [
		s.hoveredState,
		s.setHoveredState,
	])
	const caseProp = relative ? 'ptc' : 'tc'
	const caseLeftProp = relative ? 'pnc' : 'nc'
	const deathProp = relative ? 'ptd' : 'td'
	const deathLeftProp = relative ? 'pnd' : 'nd'
	const recoveredProp = relative ? 'ptr' : 'tr'
	const recoveredLeftProp = relative ? 'pnr' : 'nr'

	const columns: Column<StateEntry>[] = useMemo(
		() => [
			{
				accessor: 'st',
				Header: (x: Header) => (
					<Header isVisible={true} {...x}>
						<Mobile>St</Mobile>
						<Desktop>State</Desktop>
					</Header>
				),
				sortInverted: true,
				Cell: ({ row }: Cell) => (
					<Cell>
						<span
							// @ts-ignore
							title={statesMeta?.[row.values.st].n}
						>
							{row.values.st}
						</span>
					</Cell>
				),
			},
			{
				accessor: 'tc',
				Header: (x: Header) => (
					<Header isVisible={!relative} {...x}>
						Confirmed
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='nc'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
						isVisible={!relative}
					/>
				),
			},
			{
				accessor: 'td',
				Header: (x: Header) => (
					<Header isVisible={!relative} {...x}>
						Deaths
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='nd'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
						isVisible={!relative}
					/>
				),
			},
			{
				accessor: 'tr',
				Header: (x: Header) => (
					<Header isVisible={!relative} {...x}>
						Recovered
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='nr'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
						isVisible={!relative}
					/>
				),
			},
			{
				accessor: 'ptc',
				sortType: 'basic',
				Header: (x: Header) => (
					<Header isVisible={relative} {...x}>
						Confirmed
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='pnc'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
						isVisible={relative}
					/>
				),
			},
			{
				accessor: 'ptd',
				sortType: 'basic',
				Header: (x: Header) => (
					<Header isVisible={relative} {...x}>
						Deaths
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='pnd'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
						isVisible={relative}
					/>
				),
			},
			{
				accessor: 'ptr',
				sortType: 'basic',
				Header: (x: Header) => (
					<Header isVisible={relative} {...x}>
						Recovered
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='pnr'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
						isVisible={relative}
					/>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data, relative],
	)

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		state,
		toggleSortBy,
	} = useTable(
		{
			columns,
			// @ts-ignore
			initialState,
			data,
			footerGroups: total,
			autoResetSortBy: false,
		},
		useSortBy,
	)

	useEffect(() => {
		if (sort !== state.sortBy[0].id) {
			toggleSortBy(sort, true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sort])

	useEffect(() => {
		setSort(initialState.sortBy[0].id)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<Wrapper>
			<Table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup: any) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column: any) => (
								<th
									{...column.getHeaderProps(
										column.getSortByToggleProps({
											onClick: () => {
												setSort(column.id)
												toggleSortBy(column.id, true)
											},
										}),
									)}
								>
									{column.render('Header')}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row: any) => {
						prepareRow(row)
						return (
							<TableRow
								{...row.getRowProps({
									onMouseEnter: () => setHoveredState(row.original.st),
									onMouseLeave: () => setHoveredState(null),
									active: row.original.st === hoveredState,
								})}
							>
								{row.cells.map((cell: any) => (
									<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								))}
							</TableRow>
						)
					})}
					<TotalRow>
						<td>
							<Cell transform='capitalize'>{total.st.toLowerCase()}</Cell>
						</td>
						{relative && (
							<>
								<td />
								<td />
								<td />
							</>
						)}
						<td>
							<Cell left={getCellRender(relative, true)(total[caseLeftProp])}>
								{getCellRender(relative)(total[caseProp])}
							</Cell>
						</td>
						<td>
							<Cell left={getCellRender(relative, true)(total[deathLeftProp])}>
								{getCellRender(relative)(total[deathProp])}
							</Cell>
						</td>
						<td>
							<Cell
								left={getCellRender(relative, true)(total[recoveredLeftProp])}
							>
								{getCellRender(relative)(total[recoveredProp])}
							</Cell>
						</td>
						{!relative && (
							<>
								<td />
								<td />
								<td />
							</>
						)}
					</TotalRow>
				</tbody>
			</Table>
		</Wrapper>
	)
}

export default StatesTable
