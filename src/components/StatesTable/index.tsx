import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useTable, useSortBy } from 'react-table'

export type StateEntry = {
	date: string
	st: string
	td: string
	nd: string
	nc: string
	tc: string
}

export type StateEntries = StateEntry[]

type Accessor<T> = keyof T

type Column = {
	accessor: Accessor<StateEntry>
	Header: string | ReactNode
	Cell?: any
}

type Columns = Column[]

type Cell = { row: { values: StateEntry } }
type CellProps = {
	row: { values: StateEntry }
	prop: keyof StateEntry
	children?: ReactNode
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

const Cell = ({ row, prop, children }: CellProps) => <strong>{row.values?.[prop]}{children}</strong>

const Header = ({ children, column }: HeaderProps) => (
	<div>
		<strong>{children}</strong>
		{' '}
		{column.isSorted ? (column.isSortedDesc ? '↓' : '↑') : '↕'}
	</div>
)

const columns: Columns = [
	{ accessor: 'st', Header: (x: Header) => <Header {...x}>State</Header> },
	{
		accessor: 'tc',
		Header: (x: Header) => <Header {...x}>Total cases</Header>,
		Cell: ({ row }: Cell) => <Cell row={row} prop='tc' />,
	},
	{
		accessor: 'nc',
		Header: (x: Header) => <Header {...x}>New cases</Header>,
		Cell: ({ row }: Cell) => <Cell row={row} prop='nc' />,
	},
	{
		accessor: 'td',
		Header: (x: Header) => <Header {...x}>Deaths</Header>,
		Cell: ({ row }: Cell) => <Cell row={row} prop='td' />,
	},
	{
		accessor: 'nd',
		Header: (x: Header) => <Header {...x}>New deaths</Header>,
		Cell: ({ row }: Cell) => <Cell row={row} prop='nd' />,
	},
]

const accessors: Accessor<StateEntry>[] = columns.map(
	({ accessor }) => accessor,
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

const StatesTable = ({ data, total }: StatesTableProps) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		// @ts-ignore
	} = useTable({ columns, data, autoResetSortBy: false }, useSortBy)
	return (
		<Table {...getTableProps()}>
			<thead>
				{headerGroups.map((headerGroup: any) => (
					<tr {...headerGroup.getHeaderGroupProps()}>
						{headerGroup.headers.map((column: any) => (
							<th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
					{Object.entries(total)
						//@ts-ignore
						.filter(([k]) => accessors.includes(k))
						.map(([k, v]) => (
							<td key={k}>{v}</td>
						))}
				</tr>
			</tbody>
		</Table>
	)
}

export default StatesTable
