import React, { ReactNode, useMemo } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, Column } from 'react-table'
import Text from 'components/Text'
import type { Transform } from 'components/Text'

export type StateEntry = {
	date: string
	st: string
	td: number
	nd: number
	rtd?: number | null
	ptd?: number | null
	tc: number
	nc: number
	rtc?: number | null
	ptc?: number | null
}

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

const Cell = ({ left, children, transform, bold = true }: StaticCellProps) => (
	<CellWrapper transform={transform}>
		{!!left && <Text>{left}</Text>}
		{'\t'}
		{bold && <strong>{children}</strong>}
		{!bold && <div>{children}</div>}
	</CellWrapper>
)

type DynamicCellProps = {
	row: RowProps
	data?: StateEntry[]
	column: { id: keyof StateEntry }
	leftProp?: keyof StateEntry
	leftRender?: (x: ReactNode) => ReactNode
	children?: ReactNode
}

const DynamicCell = ({
	row,
	column,
	data,
	leftProp,
	leftRender = x => `+${x}`,
	children,
}: DynamicCellProps) => (
	<Cell left={leftProp && leftRender(data?.[row.index]?.[leftProp])}>
		{children || row.values?.[column.id]}
	</Cell>
)

const HeaderWrapper = styled(Text)`
	display: flex;
	justify-content: space-between;
	padding: 0.5rem 0.75rem;
	border-radius: 0.25rem;
	background: var(--color-base06);
	color: var(--color-base66);
	box-shadow: 0 0 0 0.25rem var(--color-base00);
	&:hover {
		background: var(--color-base);
		color: var(--color-base00);
	}
`

const Header = ({ children, column }: HeaderProps) => (
	<HeaderWrapper>
		<strong>{children}</strong>{' '}
		<span>{column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '·'}</span>
	</HeaderWrapper>
)

const TotalRow = styled.tr`
	td {
		background: transparent !important;
		position: sticky;
		bottom: 0;
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
		top: 1.125rem;
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

type StateMeta = {
	p: number
	n: string
}

export type StatesMeta = {
	[key: string]: StateMeta
}

type StatesTableProps = {
	data: StateEntry[]
	total: StateEntry
	statesMeta: StatesMeta
	relative: boolean
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

const RelativeRender = ({ x }: { x: number }) => (
	<span title={`${x * 10000} a cada 10 mil hab`}>
		{(x * 10000).toFixed(3)}‱
	</span>
)

const getLeftRender = (relative: boolean) => (x: ReactNode) => {
	if (!x) return null
	if (relative && typeof x === 'number') return <RelativeRender x={x} />
	return `+${x}`
}

const StatesTable = ({
	data,
	total,
	statesMeta,
	relative,
}: StatesTableProps) => {
	const caseProp = relative ? 'ptc' : 'nc'
	const deathProp = relative ? 'ptd' : 'nd'

	const columns: Column<StateEntry>[] = useMemo(
		() => [
			{
				accessor: 'st',
				Header: (x: Header) => <Header {...x}>State</Header>,
				sortInverted: true,
				Cell: ({ row }: Cell) => (
					<Cell bold={false}>
						<strong>{statesMeta[row.values.st].n}</strong>
					</Cell>
				),
			},
			{
				accessor: 'tc',
				Header: (x: Header) => <Header {...x}>Confirmed</Header>,
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp={caseProp}
						leftRender={getLeftRender(relative)}
					/>
				),
			},
			{
				accessor: 'td',
				Header: (x: Header) => <Header {...x}>Deaths</Header>,
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp={deathProp}
						leftRender={getLeftRender(relative)}
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
											onClick: () => toggleSortBy(column.id, true),
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
							<tr {...row.getRowProps()}>
								{row.cells.map((cell: any) => (
									<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								))}
							</tr>
						)
					})}
					<TotalRow>
						<td>
							<Cell transform='capitalize'>{total.st.toLowerCase()}</Cell>
						</td>
						<td>
							<Cell left={getLeftRender(relative)(total[caseProp])}>
								{total.tc}
							</Cell>
						</td>
						<td>
							<Cell left={getLeftRender(relative)(total[deathProp])}>
								{total.td}
							</Cell>
						</td>
					</TotalRow>
				</tbody>
			</Table>
		</Wrapper>
	)
}

export default StatesTable
