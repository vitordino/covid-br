import React, { useMemo, useEffect } from 'react'
import { useTable, useSortBy, Column } from 'react-table'

import useStore from 'store'
import type { CellProps } from './shared'

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

type StateMeta = {
	p: number
	n: string
}

type StateTableProps = {
	data: CityEntry[]
	total: CityEntry
	hasRange: boolean
}

const StateTable = ({ data, total, hasRange }: StateTableProps) => {
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])
	const relative = useStore(s => s.relative)
	const [hoveredState, setHoveredState] = useStore(s => [
		s.hoveredState,
		s.setHoveredState,
	])

	const caseProp = relative ? 'ptc' : 'tc'
	const caseLeftProp = relative ? null : 'nc'
	const deathProp = relative ? 'ptd' : 'td'
	const deathLeftProp = relative ? null : 'nd'

	const columns: Column<CityEntry>[] = useMemo(
		() => [
			{
				accessor: 'ct',
				Header: (x: any) => (
					<Header isVisible={true} {...x}>
						<Mobile>Ct</Mobile>
						<Desktop>City</Desktop>
					</Header>
				),
				sortInverted: true,
				Cell: ({ row }: CellProps<CityEntry>) => (
					<Cell>
						<span
							// @ts-ignore
							title={row.values.ct}
						>
							{row.values.ct}
						</span>
					</Cell>
				),
			},
			{
				accessor: 'tc',
				Header: (x: any) => (
					<Header isVisible={!relative} {...x}>
						Confirmados
					</Header>
				),
				Cell: ({ row, column }: CellProps<CityEntry>) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={caseProp}
						leftProp={caseLeftProp}
						leftRender={getCellRender(false, true)}
						mainRender={getCellRender(false, false)}
						isVisible={!relative}
					/>
				),
			},
			{
				accessor: 'td',
				Header: (x: any) => (
					<Header isVisible={!relative} {...x}>
						Óbitos
					</Header>
				),
				Cell: ({ row, column }: CellProps<CityEntry>) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={deathProp}
						leftProp={deathLeftProp}
						leftRender={getCellRender(false, true)}
						mainRender={getCellRender(false, false)}
						isVisible={!relative}
					/>
				),
			},
			{
				accessor: 'ptc',
				Header: (x: any) => (
					<Header isVisible={relative} {...x}>
						Confirmados
					</Header>
				),
				Cell: ({ row, column }: CellProps<CityEntry>) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={caseProp}
						leftProp={caseLeftProp}
						leftRender={getCellRender(true, true)}
						mainRender={getCellRender(true, false)}
						isVisible={relative}
					/>
				),
			},
			{
				accessor: 'ptd',
				Header: (x: any) => (
					<Header isVisible={relative} {...x}>
						Óbitos
					</Header>
				),
				Cell: ({ row, column }: CellProps<CityEntry>) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={deathProp}
						leftProp={deathLeftProp}
						leftRender={getCellRender(true, true)}
						mainRender={getCellRender(true, false)}
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
		if (!sort && sort !== state.sortBy[0].id) {
			toggleSortBy(sort, true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sort])

	useEffect(() => {
		const id = initialState.sortBy[0].id
		if (data?.[0]?.[id]) setSort(id)
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
									onMouseEnter: () => setHoveredState(row.original.ct),
									onMouseLeave: () => setHoveredState(null),
									active: row.original.ct === hoveredState,
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
					<TotalRow hasRange={hasRange}>
						<td>
							<Cell transform='capitalize'>Total</Cell>
						</td>
						<EmptyCells count={2} isVisible={relative} />
						<td>
							<Cell
								left={
									caseLeftProp &&
									getCellRender(relative, true)(total[caseLeftProp])
								}
							>
								{getCellRender(relative)(total[caseProp])}
							</Cell>
						</td>
						<td>
							<Cell
								left={
									deathLeftProp &&
									getCellRender(relative, true)(total[deathLeftProp])
								}
							>
								{getCellRender(relative)(total[deathProp])}
							</Cell>
						</td>
						<EmptyCells count={2} isVisible={!relative} />
					</TotalRow>
				</tfoot>
			</Table>
		</Wrapper>
	)
}

export default StateTable
