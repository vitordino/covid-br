import React, { ReactNode, useMemo } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, Column } from 'react-table'

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
}

const Cell = ({ left, children }: StaticCellProps) => (
	<div style={{ display: 'flex' }}>
		{!!left && <small style={{ flex: 1 }}>{left}</small>}
		{'\t'}
		<strong style={{ flex: 1 }}>{children}</strong>
	</div>
)

type DynamicCellProps = {
	row: RowProps
	data?: StateEntry[]
	column: { id: keyof StateEntry }
	leftProp?: keyof StateEntry
	leftRender?: (x: ReactNode) => ReactNode
	children?: ReactNode
	toggleSortBy?: (id: string, desc?: boolean, isMulti?: boolean) => void
}

const DynamicCell = ({
	row,
	column,
	data,
	leftProp,
	leftRender = (x) => `+${x}`,
	children,
}: DynamicCellProps) => (
	<Cell left={leftProp && leftRender(data?.[row.index]?.[leftProp])}>
		{row.values?.[column.id]}
		{children}
	</Cell>
)

const Header = ({ children, column }: HeaderProps) => (
	<div>
		<strong>{children}</strong>{' '}
		{column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '·'}
	</div>
)

const Table = styled.table`
	width: 100%;
	text-align: right;
	th:first-child,
	td:first-child {
		text-align: left;
	}
`

type StatesTableProps = {
	data: StateEntry[]
	total: StateEntry
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

const StatesTable = ({ data, total }: StatesTableProps) => {
	const columns: Column<StateEntry>[] = useMemo(
		() => [
			{
				accessor: 'st',
				Header: (x: Header) => <Header {...x}>State</Header>,
				sortInverted: true,
			},
			{
				accessor: 'tc',
				Header: (x: Header) => <Header {...x}>Confirmed</Header>,
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						leftProp='nc'
						toggleSortBy={toggleSortBy}
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
						leftProp='nd'
						toggleSortBy={toggleSortBy}
					/>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
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
			// @ts-ignore
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
				<tr>
					<td>
						<Cell>{total.st}</Cell>
					</td>
					<td>
						<Cell left={total.nc}>{total.tc}</Cell>
					</td>
					<td>
						<Cell left={total.nd}>{total.td}</Cell>
					</td>
				</tr>
			</tbody>
		</Table>
	)
}

export default StatesTable
