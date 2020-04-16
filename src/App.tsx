import React, { useState, useMemo } from 'react'
import { useTable } from 'react-table'

import data from './data/states.json'

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

type Column = {
	accessor: keyof StateEntry
	Header: string
}

type Columns = Column[]

const main: Main = data.main
const dates: Array<string> = data.dates

const columns: Columns = [
	{ accessor: 'st', Header: 'State' },
	{ accessor: 'td', Header: 'Deaths' },
	{ accessor: 'nd', Header: 'New deaths' },
	{ accessor: 'nc', Header: 'New cases' },
	{ accessor: 'tc', Header: 'Cases' },
]

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const data: StateEntries = useMemo(() => main[dates[index]], [index])

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({ columns, data })
	return (
		<>
			<input
				type='range'
				min='0'
				max={dates.length - 1}
				value={index}
				onChange={({ target }) => setIndex(parseInt(target.value))}
			/>
			<pre>{dates[index]}</pre>
			<table {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps()}>{column.render('Header')}</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row)
						return (
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => (
									<td {...cell.getCellProps()}>{cell.render('Cell')}</td>
								))}
							</tr>
						)
					})}
				</tbody>
			</table>
		</>
	)
}

export default App
