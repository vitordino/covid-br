import React, { ReactNode, useMemo } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'

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

export type StateEntries = StateEntry[]

type Accessor<T> = keyof T

type Column = {
	accessor: Accessor<StateEntry>
	Header: string | ReactNode
	Cell?: any
	[key: string]: any
}

type Columns = Column[]

type RowProps = {
	values: StateEntry
	index: number
}

type Cell = {
	row: RowProps
	data: StateEntries
	[key: string]: any
}
type CellProps = {
	row: RowProps
	data?: StateEntries
	prop: keyof StateEntry
	leftProp?: keyof StateEntry
	leftRender?: (x: ReactNode) => ReactNode
	children?: ReactNode
	toggleSortBy?: (id: string, desc?: boolean, isMulti?: boolean) => void
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

const noop = () => null

const Cell = ({
	row,
	data,
	prop,
	leftProp,
	leftRender = (x) => `+${x}`,
	children,
	toggleSortBy = noop,
}: CellProps) => (
	<div style={{ display: 'flex' }}>
		{leftProp && !!data?.[row.index]?.[leftProp] && (
			<small onClick={() => toggleSortBy(leftProp, true)} style={{ flex: 1 }}>
				{leftRender(data[row.index][leftProp])}
			</small>
		)}
		{'\t'}
		<strong style={{ flex: 1 }}>
			{row.values?.[prop]}
			{children}
		</strong>
	</div>
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
	data: StateEntries
	total: StateEntry
}

type SortByOptions = {
	id: Accessor<StateEntry>
	desc: boolean
}

type InitialTableState = {
	sortBy: SortByOptions[]
}

const initialState: InitialTableState = {
	sortBy: [{ id: 'tc', desc: true }],
}

const StatesTable = ({ data, total }: StatesTableProps) => {
	const columns: Columns = useMemo(
		() => [
			{
				accessor: 'st',
				Header: (x: Header) => <Header {...x}>State</Header>,
				sortInverted: true,
			},
			{
				accessor: 'tc',
				Header: (x: Header) => <Header {...x}>Confirmed</Header>,
				Cell: ({ row, data }: Cell) => (
					<Cell
						row={row}
						data={data}
						prop='tc'
						leftProp='nc'
						toggleSortBy={toggleSortBy}
					/>
				),
			},
			{
				accessor: 'td',
				Header: (x: Header) => <Header {...x}>Deaths</Header>,
				Cell: ({ row }: Cell) => (
					<Cell
						row={row}
						data={data}
						prop='td'
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
				{/* <tr>
					<td>
						<Cell row={{ values: total }} prop='st' />
					</td>
					<td>
						<Cell row={{ values: total }} prop='tc' leftProp='nc' />
					</td>
					<td>
						<Cell row={{ values: total }} prop='td' leftProp='nd'>
						</Cell>
					</td>
				</tr> */}
			</tbody>
		</Table>
	)
}

export default StatesTable
