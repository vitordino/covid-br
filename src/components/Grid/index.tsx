import { ReactNode } from 'react'
import styled from 'styled-components'
import { mapTheme, mapBreakpoints } from 'etymos'

const getColumnDisplay = ({ flex }: { flex?: boolean }) =>
	flex ? 'flex' : 'block'

type ColumnProps = {
	children: ReactNode
	flex: boolean
	[key: string]: any
}

// prettier-ignore
const Column = styled.div<ColumnProps>`
	box-sizing: border-box;
	${mapTheme(({ gutter }) => gutter && `
		padding-left: ${gutter / 2}px;
		padding-right: ${gutter / 2}px;
	`)}
	${mapBreakpoints((value, props) => `
		display: ${value > 0 ? getColumnDisplay(props) : 'none'};
		width: ${(value / props.theme.columns || 1) * 100}%;
	`)}
`

type RowProps = {
	'vertical-gutter'?: any
	children: ReactNode
	[key: string]: any
}

// prettier-ignore
const Row = styled.div<RowProps>`
	box-sizing: border-box;
	flex: 1;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: flex-start;
	${mapTheme(({ gutter }, props) => gutter && !props['vertical-gutter'] && `
		margin-left: ${gutter / -2}px;
		margin-right: ${gutter / -2}px;
		max-width: calc(100% + ${gutter}px);
	`)}
	${mapTheme(({ gutter }, props) => gutter && props['vertical-gutter'] && `
		margin: ${gutter / -2}px;
		& ${Column} {padding: ${gutter / 2}px;}
	`)}
`

const Grid = { Row, Column }

export default Grid
