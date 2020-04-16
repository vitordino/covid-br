import React from 'react'
import { useTable, useSortBy } from 'react-table'

type StateEntry = {
	date: string
	st: string
	td: string
	nd: string
	nc: string
	tc: string
}

type StateEntries = StateEntry[]

type Main = {
	[key: string]: StateEntry[]
}

type Acessor<T> = keyof T

type Column = {
	accessor: Acessor<StateEntry>
	Header: string
}

type Columns = Column[]

const columns: Columns = [
	{ accessor: 'st', Header: 'State' },
	{ accessor: 'td', Header: 'Deaths' },
	{ accessor: 'nd', Header: 'New deaths' },
	{ accessor: 'nc', Header: 'New cases' },
	{ accessor: 'tc', Header: 'Cases' },
]

const accessors: Acessor<StateEntry>[] = columns.map(({ accessor }) => accessor)

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
		<table {...getTableProps()}>
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
		</table>
	)
}

export default StatesTable
