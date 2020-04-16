import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

type HorizontalProps = {
	block: boolean
	margin: number
}

type VerticalProps = {
	inline: boolean
	margin: number
}

const H = styled.div<HorizontalProps>`
	display: ${({ block }) => (block ? 'flex' : 'inline-flex')};
	${mapBreakpoints((value, { margin }) =>
		margin ? `margin: 0 ${value / 2}rem;` : `padding: 0 ${value / 2}rem;`,
	)}
`

const V = styled.div<VerticalProps>`
	display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
	${mapBreakpoints((value, { margin }) =>
		margin ? `margin: ${value / 2}rem 0;` : `padding: ${value / 2}rem 0;`,
	)}
`

const Spacer = { V, H }

export default Spacer
