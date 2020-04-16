import React, { useState, useMemo } from 'react'
import { useTable, useSortBy } from 'react-table'

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

type Acessor = keyof StateEntry

type Column = {
	accessor: Acessor
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

const accessors: Acessor[] = columns.map(({ accessor }) => accessor)

const removeTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st !== 'TOTAL')
const findTotal = (lines: StateEntries) =>
	lines.filter(({ st }) => st === 'TOTAL')[0]

const App = () => {
	const [index, setIndex] = useState(dates.length - 1)
	const data: StateEntries = useMemo(() => removeTotal(main[dates[index]]), [
		index,
	])
	const total: StateEntry = useMemo(() => findTotal(main[dates[index]]), [
		index,
	])

	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable({ columns, data }, useSortBy)
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
								// @ts-ignore
								<th {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render('Header')}
								</th>
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
					<tr>
						{Object.entries(total)
							// @ts-ignore
							.filter(([k]) => accessors.includes(k))
							.map(([k, v]) => (
								<td key={k}>{v}</td>
							))}
					</tr>
				</tbody>
			</table>
		</>
	)
}

export default App
