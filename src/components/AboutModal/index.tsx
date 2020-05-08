import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { parse } from 'query-string'

import useScrollLock from 'hooks/useScrollLock'
import useKeyPress from 'hooks/useKeyPress'
import Portal from 'components/Portal'
import Text from 'components/Text'
import Spacer from 'components/Spacer'
import Container from 'components/Container'

type Props = {
	isVisible?: boolean
}

const Wrapper = styled.div<Props>`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-end;
	pointer-events: none;
	${p =>
		p.isVisible &&
		`
		pointer-events: all;
	`}
`

const Backdrop = styled.div<Props>`
	backdrop-filter: blur(0.25rem) grayscale(0.5);
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	opacity: 0;
	transition: opacity 0.3s;
	${p =>
		p.isVisible &&
		`
		opacity: 1;
	`}
`

const Background = styled(Link)<Props>`
	display: block;
	cursor: pointer;
	background: #000;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	opacity: 0;
	transition: opacity 0.3s;
	${p =>
		p.isVisible &&
		`
		opacity: 0.22;
	`}
`

const Inner = styled(Container)<Props>`
	padding: 1.5rem 1rem 2rem;
	background: var(--color-base00);
	width: 100%;
	border-radius: 0.25rem 0.25rem 0 0;
	position: relative;
	bottom: 0;
	max-width: 32rem;
	box-shadow: 0 0 2rem rgba(0, 0, 0, 0.44);
	transition: transform 0.2s ease-out;
	transform: translateY(100%);
	${p =>
		p.isVisible &&
		`
		transform: translateY(0);
	`}
`

type AnchorProps = {
	children: ReactNode
	[key: string]: any
}

const Anchor = ({ children, ...props }: AnchorProps) => (
	<a target='_blank' rel='noopener noreferrer' {...props}>
		{children}
	</a>
)

const AboutModal = () => {
	const { push } = useHistory()
	const { search, pathname } = useLocation()
	const { about } = parse(search)
	const isVisible = typeof about !== 'undefined'

	const onEsc = () => {
		if (!isVisible) return
		push(pathname, { query: '' })
	}

	useScrollLock(isVisible)
	useKeyPress('Escape', onEsc)
	return (
		<Portal>
			<Wrapper isVisible={isVisible}>
				<Backdrop isVisible={isVisible} />
				<Background to='/' isVisible={isVisible} />
				<Inner isVisible={isVisible}>
					<Text xs={3} as='h2' weight={500}>
						About COVID — BR
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						This project is done by{' '}
						<Anchor href='https://vitordino.com'>Vitor Dino</Anchor>, open
						sourced on
						<Anchor href='https://github.com/vitordino/covid-br'>
							<code>vitordino/covid-br</code>
						</Anchor>{' '}
						github repository with a{' '}
						<Anchor href='https://github.com/vitordino/covid-br/blob/master/LICENSE'>
							<code>MIT</code> License
						</Anchor>
						.
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						The data is sourced from{' '}
						<Anchor href='https://github.com/wcota/covid19br'>
							<code>wcota/covid19br</code>
						</Anchor>{' '}
						github repository under a{' '}
						<Anchor
							target='_blank'
							href='https://github.com/wcota/covid19br/blob/master/LICENSE.md'
							title='Creative Commons Attribution Share Alike 4.0 International'
						>
							<code>CC BY-SA 4.0</code> License
						</Anchor>
						.
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						The icon used is part of{' '}
						<Anchor href='fontawesome.com'>fontawesome.com</Anchor>, and can be
						found{' '}
						<Anchor href='https://fontawesome.com/icons/shield-virus?style=solid'>
							here
						</Anchor>{' '}
						and is using a{' '}
						<Anchor
							href='https://fontawesome.com/license'
							title='Creative Commons Attribution Share Alike 4.0 International'
						>
							<code>CC BY-SA 4.0</code> License
						</Anchor>
						.
					</Text>
				</Inner>
			</Wrapper>
		</Portal>
	)
}

export default AboutModal