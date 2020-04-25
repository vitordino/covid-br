import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

import getTypeStyle from '~/utils/getTypeStyle'

const Text = styled.div`
	${p => p.color && `color: var(--color-${p.color});`}
	${p => p.background && `background: var(--color-${p.background});`}
	${p => p.weight && `font-weight: ${p.weight};`}
	${p => p.case && `text-transform: ${p.case};`}
	${p => p.family && `font-family: ${p.theme.type.fonts?.[p.family]};`}
	${({ theme }) => theme.transition.get()};
	${mapBreakpoints(getTypeStyle)}
`

Text.defaultProps = { xs: 0 }

export default Text
