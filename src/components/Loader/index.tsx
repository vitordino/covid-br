import React from 'react'
import styled from 'styled-components'

import Portal from 'components/Portal'

type Props = {
	isVisible?: boolean
}

const Wrapper = styled.div<Props>`
	position: absolute;
	display: flex;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	opacity: 0;
	z-index: 1;
	transition: 0.3s opacity;
	color: var(--color-base22);
	${p => p.isVisible && `opacity: 1;`}
	& svg {
		display: block;
	}
`

const Loader = ({ isVisible = true }) => (
	<Portal root={2}>
		<Wrapper isVisible={isVisible}>
			<svg width='44' height='44' viewBox='0 0 44 44' stroke='currentColor'>
				<g fill='none' fillRule='evenodd' strokeWidth='2'>
					<circle cx='22' cy='22' r='1'>
						<animate
							attributeName='r'
							begin='0s'
							dur='1.8s'
							values='1; 20'
							calcMode='spline'
							keyTimes='0; 1'
							keySplines='0.165, 0.84, 0.44, 1'
							repeatCount='indefinite'
						/>
						<animate
							attributeName='stroke-opacity'
							begin='0s'
							dur='1.8s'
							values='1; 0'
							calcMode='spline'
							keyTimes='0; 1'
							keySplines='0.3, 0.61, 0.355, 1'
							repeatCount='indefinite'
						/>
					</circle>
					<circle cx='22' cy='22' r='1'>
						<animate
							attributeName='r'
							begin='-0.9s'
							dur='1.8s'
							values='1; 20'
							calcMode='spline'
							keyTimes='0; 1'
							keySplines='0.165, 0.84, 0.44, 1'
							repeatCount='indefinite'
						/>
						<animate
							attributeName='stroke-opacity'
							begin='-0.9s'
							dur='1.8s'
							values='1; 0'
							calcMode='spline'
							keyTimes='0; 1'
							keySplines='0.3, 0.61, 0.355, 1'
							repeatCount='indefinite'
						/>
					</circle>
				</g>
			</svg>
		</Wrapper>
	</Portal>
)

export default Loader
