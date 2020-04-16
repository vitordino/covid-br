import React from 'react'
import styled from 'styled-components'

import { useColorMode } from '../../store'

const Button = styled.button`
	display: block;
	padding: 1rem;
	position: fixed;
	bottom: 0;
	right: 0;
	opacity: 0.25;
	transition: 0.2s opacity;
	color: var(--color-base) !important;
	transition: 0.25s opacity;
	&:hover {
		opacity: 1;
	}
`

type InnerProps = {
	size: number | string
}

const Inner = styled.svg<InnerProps>`
	display: block;
	width: ${({ size }) => `${size}px`};
	height: ${({ size }) => `${size}px`};
	fill: none;
	stroke: currentColor;
	stroke-width: 2;
	stroke-linecap: round;
	stroke-linejoin: round;
	.rays {
		transition: 0.375s opacity 0.375s;
	}
	.main {
		cx: 12px;
		cy: 12px;
		r: 5px;
		transition: 0.375s r 0.375s, 0.75s stroke;
	}
	.other {
		cx: 12px;
		cy: 12px;
		r: 5px;
		stroke: transparent;
		transition: 0.375s cx, 0.375s cy, 0.375s r 0.375s, 0.125s stroke 0.25s;
	}
	.maskMain {
		cx: 12px;
		cy: 12px;
		r: 11px;
	}
	.maskOther {
		r: 4px;
		cx: 12px;
		cy: 12px;
		transition: 0.375s cx, 0.375s cy, 0.375s r 0.375s;
	}
	html[data-theme='dark'] & {
		.rays {
			opacity: 0;
			transition: 0.375s all;
		}
		.main {
			r: 10px;
			transition: 0.375s r, 0.75s stroke;
		}
		.other {
			stroke: currentColor;
			r: 9px;
			cx: 18px;
			cy: 6px;
			transition: 0.375s r, 0.375s cx 0.375s, 0.375s cy 0.375s, 0.375s stroke;
		}
		.maskOther {
			r: 8px;
			cx: 18px;
			cy: 6px;
			transition: 0.375s r, 0.375s cx 0.375s, 0.375s cy 0.375s;
		}
	}
`

const ColorModeSwitcher = ({ size = 20, ...props }) => {
	const [colorMode, setColorMode] = useColorMode()
	const colorSwitch = () =>
		setColorMode(colorMode === 'light' ? 'dark' : 'light')

	return (
		<Button type='button' onClick={colorSwitch} {...props}>
			<Inner size={size} viewBox='0 0 24 24'>
				<defs>
					<mask id='mask' stroke='none'>
						<circle className='maskMain' fill='#fff' />
						<circle className='maskOther' fill='#000' />
					</mask>
				</defs>
				<g className='rays'>
					<line x1='12' y1='1' x2='12' y2='3' />
					<line x1='12' y1='21' x2='12' y2='23' />
					<line x1='4.22' y1='4.22' x2='5.64' y2='5.64' />
					<line x1='18.36' y1='18.36' x2='19.78' y2='19.78' />
					<line x1='1' y1='12' x2='3' y2='12' />
					<line x1='21' y1='12' x2='23' y2='12' />
					<line x1='4.22' y1='19.78' x2='5.64' y2='18.36' />
					<line x1='18.36' y1='5.64' x2='19.78' y2='4.22' />
				</g>
				<g className='circles' mask='url(#mask)'>
					<circle className='main' />
					<circle className='other' />
				</g>
			</Inner>
		</Button>
	)
}

export default ColorModeSwitcher
