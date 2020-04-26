import React, { ReactNode } from 'react'
import { ThemeProvider as Provider } from 'styled-components'
import { above } from 'etymos'

import colors from 'theme/colors'
import type { ColorModes } from 'theme/colors'
import responsive from 'theme/responsive'
import type { Breakpoints } from 'theme/responsive'
import typography from 'theme/type'
import type Typography from 'theme/type'
import transition from 'theme/transition'

export type Theme = {
	colors: ColorModes
	type: typeof Typography
	breakpoints: Breakpoints
	columns: number
	[key: string]: any
}

const theme: Theme = {
	above,
	colors,
	...responsive,
	type: typography,
	transition,
}

type ThemeProviderProps = {
	children: ReactNode
}

export type TypoEnum = keyof typeof theme.type.scale
export type BreakpointEnum = keyof typeof theme.breakpoints
export type FontEnum = keyof typeof theme.type.fonts
export type ColorEnum =
	| keyof typeof theme.colors.light
	| keyof typeof theme.colors.dark

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
	<Provider theme={theme}>{children}</Provider>
)

export default theme
