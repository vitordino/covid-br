// @ts-nocheck
import React, { useMemo, useEffect } from 'react'
import { useTable, useSortBy, Column } from 'react-table'

import useStore from 'store'

import type { RowProps, CellProps } from './shared'

import {
	Cell,
	DynamicCell,
	Header,
	TotalRow,
	Wrapper,
	Table,
	Mobile,
	Desktop,
	TableRow,
	initialState,
	getCellRender,
	EmptyCells,
} from './shared'

type Cell = {
	row: RowProps
	column: { id: keyof StateEntry }
	data: StateEntry[]
	[key: string]: any
}

type StateMeta = {
	p: number
	n: string
}

type CountryTableProps = {
	data: StateEntry[]
	total: StateEntry
	statesMeta: StatesMeta
}

const CountryTable = ({ data, total, statesMeta }: CountryTableProps) => {
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])
	const relative = useStore(s => s.relative)
	const daily = useStore(s => s.daily)
	const [hoveredState, setHoveredState] = useStore(s => [
		s.hoveredState,
		s.setHoveredState,
	])

	const caseProp = relative ? (daily ? 'pnc' : 'ptc') : daily ? 'nc' : 'tc'
	const caseLeftProp = relative ? 'pnc' : 'nc'
	const deathProp = relative ? (daily ? 'pnd' : 'ptd') : daily ? 'nd' : 'td'
	const deathLeftProp = relative ? 'pnd' : 'nd'
	const recoveredProp = relative ? (daily ? 'pnr' : 'ptr') : daily ? 'nr' : 'tr'
	const recoveredLeftProp = relative ? 'pnr' : 'nr'

	const columns: Column<StateEntry>[] = useMemo(
		() => [
			{
				accessor: 'st',
				Header: (x: any) => (
					<Header isVisible={true} {...x}>
						<Mobile>St</Mobile>
						<Desktop>State</Desktop>
					</Header>
				),
				sortInverted: true,
				Cell: ({ row }: CellProps) => (
					<Cell to={`/${row.values.st.toLowerCase()}`}>
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
				Header: (x: any) => (
					<Header isVisible={!relative} {...x}>
						Confirmed
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={caseProp}
						leftProp='nc'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, daily)}
						isVisible={!relative}
						to={`/${row.values.st.toLowerCase()}`}
					/>
				),
			},
			{
				accessor: 'td',
				Header: (x: any) => (
					<Header isVisible={!relative} {...x}>
						Deaths
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={deathProp}
						leftProp='nd'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, daily)}
						isVisible={!relative}
						to={`/${row.values.st.toLowerCase()}`}
					/>
				),
			},
			{
				accessor: 'tr',
				Header: (x: any) => (
					<Header isVisible={!relative} {...x}>
						Recovered
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={recoveredProp}
						leftProp='nr'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, daily)}
						isVisible={!relative}
						to={`/${row.values.st.toLowerCase()}`}
					/>
				),
			},
			{
				accessor: 'ptc',
				sortType: 'basic',
				Header: (x: any) => (
					<Header isVisible={relative} {...x}>
						Confirmed
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={caseProp}
						leftProp='pnc'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, daily)}
						isVisible={relative}
						to={`/${row.values.st.toLowerCase()}`}
					/>
				),
			},
			{
				accessor: 'ptd',
				sortType: 'basic',
				Header: (x: any) => (
					<Header isVisible={relative} {...x}>
						Deaths
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={deathProp}
						leftProp='pnd'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, daily)}
						isVisible={relative}
						to={`/${row.values.st.toLowerCase()}`}
					/>
				),
			},
			{
				accessor: 'ptr',
				sortType: 'basic',
				Header: (x: any) => (
					<Header isVisible={relative} {...x}>
						Recovered
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={recoveredProp}
						leftProp='pnr'
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, daily)}
						isVisible={relative}
						to={`/${row.values.st.toLowerCase()}`}
					/>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data, relative, daily],
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
				</tbody>
				<tfoot>
					<TotalRow>
						<td>
							<Cell transform='capitalize'>{total.st.toLowerCase()}</Cell>
						</td>
						<EmptyCells count={3} isVisible={relative} />
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
								{getCellRender(relative)(total[recoveredProp]) || <>&nbsp;</>}
							</Cell>
						</td>
						<EmptyCells count={3} isVisible={!relative} />
					</TotalRow>
				</tfoot>
			</Table>
		</Wrapper>
	)
}

export default CountryTable
