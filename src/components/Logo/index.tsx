import React from 'react'
import styled from 'styled-components'
import { mapBreakpoints } from 'etymos'

// prettier-ignore
const Wrapper = styled.svg`
	display: block;
	${mapBreakpoints(value => `
		height: ${value}rem;
		width: ${value}rem;
	`)}
`

type Props = Record<string, number>

const defaultProps = { xs: 1 }

const Logo = (props: Props = defaultProps) => (
	<Wrapper viewBox='0 0 512 512' {...props}>
		<path
			fill='currentColor'
			d='M224 192a16 16 0 1016 16 16 16 0 00-16-16zM466.5 83.68l-192-80A57.4 57.4 0 00256.05 0a57.4 57.4 0 00-18.46 3.67l-192 80A47.93 47.93 0 0016 128c0 198.5 114.5 335.72 221.5 380.32a48.09 48.09 0 0036.91 0C360.09 472.61 496 349.3 496 128a48 48 0 00-29.5-44.32zM384 256h-12.12c-28.51 0-42.79 34.47-22.63 54.63l8.58 8.57a16 16 0 11-22.63 22.63l-8.57-8.58c-20.16-20.16-54.63-5.88-54.63 22.63V368a16 16 0 01-32 0v-12.12c0-28.51-34.47-42.79-54.63-22.63l-8.57 8.58a16 16 0 01-22.63-22.63l8.58-8.57c20.16-20.16 5.88-54.63-22.63-54.63H128a16 16 0 010-32h12.12c28.51 0 42.79-34.47 22.63-54.63l-8.58-8.57a16 16 0 0122.63-22.63l8.57 8.58c20.16 20.16 54.63 5.88 54.63-22.63V112a16 16 0 0132 0v12.12c0 28.51 34.47 42.79 54.63 22.63l8.57-8.58a16 16 0 0122.63 22.63l-8.58 8.57c-20.16 20.16-5.88 54.63 22.63 54.63H384a16 16 0 010 32zm-96 0a16 16 0 1016 16 16 16 0 00-16-16z'
		/>
	</Wrapper>
)

export default Logo
