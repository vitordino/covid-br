import { createGlobalStyle, css } from 'styled-components'
import 'wipe.css'
import 'typeface-ibm-plex-mono'

const GlobalStyle = createGlobalStyle`
	html, body {
		text-rendering: optimizeLegibility;
		font-smoothing: antialised;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1, 'pnum' 0, 'tnum' 1, 'onum' 0, 'lnum' 1, 'dlig' 1, 'zero' 1, 'case' 1;
		height: auto;
		min-height: 100vh;
		background: var(--color-base00);
		color: var(--color-base);
		font-weight: 300;
	}
	strong {
		font-weight: 500;
	}
	::selection {
		background: var(--color-base);
		color: var(--color-base00);
	}
	body {
		overflow-x: hidden;
	}
	${({ theme }) => css`
		:root,
		[data-theme='light'] {
			--color-base: ${theme.colors.light.base};
			--color-base88: ${theme.colors.light.base88};
			--color-base66: ${theme.colors.light.base66};
			--color-base44: ${theme.colors.light.base44};
			--color-base22: ${theme.colors.light.base22};
			--color-base11: ${theme.colors.light.base11};
			--color-base06: ${theme.colors.light.base06};
			--color-base03: ${theme.colors.light.base03};
			--color-base00: ${theme.colors.light.base00};
			--color-success: ${theme.colors.light.success};
			--color-error: ${theme.colors.light.error};
		}
		[data-theme='dark'] {
			--color-base: ${theme.colors.dark.base};
			--color-base88: ${theme.colors.dark.base88};
			--color-base66: ${theme.colors.dark.base66};
			--color-base44: ${theme.colors.dark.base44};
			--color-base22: ${theme.colors.dark.base22};
			--color-base11: ${theme.colors.dark.base11};
			--color-base06: ${theme.colors.dark.base06};
			--color-base03: ${theme.colors.dark.base03};
			--color-base00: ${theme.colors.dark.base00};
			--color-success: ${theme.colors.dark.success};
			--color-error: ${theme.colors.dark.error};
		}
		body {
			font-family: ${theme.type.fonts.mono};
			${theme.transition.get()};
		}
	`}
`

export default GlobalStyle
