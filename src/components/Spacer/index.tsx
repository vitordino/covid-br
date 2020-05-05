import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

type Props = {
	[key: string]: number
}

const H = styled.div<Props>`
	${mapBreakpoints(value => `padding: 0 ${value / 2}rem;`)}
`

const V = styled.div<Props>`
	${mapBreakpoints(value => `padding: ${value / 2}rem 0;`)}
`

const Spacer = { V, H }

export default Spacer
