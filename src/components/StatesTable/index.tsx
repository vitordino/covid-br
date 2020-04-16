import React from 'react'
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
	Header: string
	Cell?: any
}

type Columns = Column[]

type CellProps = {
	row: { values: StateEntry }
}

const CasesCell = ({ row }: CellProps) => <strong>{row.values.tc}</strong>
const DeathsCell = ({ row }: CellProps) => <strong>{row.values.td}</strong>
const NewCasesCell = ({ row }: CellProps) => <small>{row.values.nc}</small>
const NewDeathsCell = ({ row }: CellProps) => <small>{row.values.nd}</small>

const columns: Columns = [
	{ accessor: 'st', Header: 'State' },
	{ accessor: 'tc', Header: 'Cases', Cell: CasesCell },
	{ accessor: 'nc', Header: 'New cases', Cell: NewCasesCell },
	{ accessor: 'td', Header: 'Deaths', Cell: DeathsCell },
	{ accessor: 'nd', Header: 'New deaths', Cell: NewDeathsCell },
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
