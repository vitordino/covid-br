import React, { ReactNode } from 'react'
import { ThemeProvider as Provider } from 'styled-components'
import { above } from 'etymos'

import colors from './colors'
import type { ColorModes } from './colors'
import responsive from './responsive'
import type { Breakpoints } from './responsive'
import typography from './type'
import type Typography from './type'
import transition from './transition'

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

export const ThemeProvider = ({ children }: ThemeProviderProps) => (
	<Provider theme={theme}>{children}</Provider>
)

export default theme
