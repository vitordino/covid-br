// @ts-nocheck
import { ReactNode } from 'react'
import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

import type { TypoEnum, BreakpointEnum, ColorEnum, FontEnum } from 'theme'
import getTypeStyle from 'utils/getTypeStyle'

export type Transform = 'none' | 'lowercase' | 'uppercase' | 'capitalize'

type TextProps = {
	weight?: number
	transform?: Transform
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
	${p => p.transform && `text-transform: ${p.transform};`}
	${p => p.family && `font-family: ${p.theme.type.fonts?.[p.family]};`}
	${({ theme }) => theme.transition.get()};
	${mapBreakpoints(getTypeStyle)}
`

Text.defaultProps = { xs: 1 }

export default Text