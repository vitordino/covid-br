import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

const H = styled.div`
	display: ${({ block }) => (block ? 'flex' : 'inline-flex')};
	${mapBreakpoints((value, { margin }) =>
		margin ? `margin: 0 ${value / 2}rem;` : `padding: 0 ${value / 2}rem;`,
	)}
`

const V = styled.div`
	display: ${({ inline }) => (inline ? 'inline-flex' : 'flex')};
	${mapBreakpoints((value, { margin }) =>
		margin ? `margin: ${value / 2}rem 0;` : `padding: ${value / 2}rem 0;`,
	)}
`

const Spacer = { V, H }

export default Spacer
