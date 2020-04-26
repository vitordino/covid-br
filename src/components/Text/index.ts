// @ts-nocheck
import { ReactNode } from 'react'
import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

import type { TypoEnum, BreakpointEnum, ColorEnum, FontEnum } from 'theme'
import getTypeStyle from 'utils/getTypeStyle'

type TextProps = {
	weight?: number
	case?: 'none' | 'lowercase' | 'uppercase' | 'capitalize'
	background?: ColorEnum
	color?: ColorEnum
	family?: FontEnum
	children?: ReactNode
	[key: BreakpointEnum]: TypoEnum
}

const Text = styled.div<TextProps>`
	${p => p.color && `color: var(--color-${p.color});`}
	${p => p.background && `background: var(--color-${p.background});`}
	${p => p.weight && `font-weight: ${p.weight};`}
	${p => p.case && `text-transform: ${p.case};`}
	${p => p.family && `font-family: ${p.theme.type.fonts?.[p.family]};`}
	${({ theme }) => theme.transition.get()};
	${mapBreakpoints(getTypeStyle)}
`

Text.defaultProps = { xs: 1 }

export default Text
