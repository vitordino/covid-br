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
} from './shared'

type Cell = {
	row: RowProps
	column: { id: keyof CityEntry }
	data: CityEntry[]
	[key: string]: any
}

type StateMeta = {
	p: number
	n: string
}

type StateTableProps = {
	data: CityEntry[]
	total: CityEntry
}

const StateTable = ({ data, total }: StateTableProps) => {
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])
	const relative = useStore(s => s.relative)

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
				Cell: ({ row }: CellProps) => (
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
						Confirmed
					</Header>
				),
				Cell: ({ row, column }: Cell) => (
					<DynamicCell
						row={row}
						column={column}
						data={data}
						prop={caseProp}
						leftProp={caseLeftProp}
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
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
						leftProp={deathLeftProp}
						leftRender={getCellRender(relative, true)}
						mainRender={getCellRender(relative, false)}
					/>
				),
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[data],
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
							<TableRow {...row.getRowProps()}>
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
							<Cell transform='capitalize'>Total</Cell>
						</td>
						<td>
							<Cell left={getCellRender(relative, true)(total[caseLeftProp])}>
								{total[caseProp]}
							</Cell>
						</td>
						<td>
							<Cell left={getCellRender(relative, true)(total[deathLeftProp])}>
								{total[deathProp]}
							</Cell>
						</td>
					</TotalRow>
				</tfoot>
			</Table>
		</Wrapper>
	)
}

export default StateTable
