import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { useLocation, useHistory } from 'react-router-dom'
import { parse } from 'query-string'

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
	padding: 1rem;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	${p =>
		p.isVisible &&
		`
		pointer-events: all;
	`}
	a {
		text-decoration: underline;
	}
`

// prettier-ignore
const Backdrop = styled.div<Props>`
	backdrop-filter: blur(0.25rem) grayscale(0.5);
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	opacity: 0;
	transition: opacity 0.2s cubic-bezier(0.4, 0, 1, 1);
	${p => p.isVisible &&`
		transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
		opacity: 1;
	`}
`

// prettier-ignore
const Background = styled.button<Props>`
	width: 100%;
	display: block;
	cursor: pointer;
	background: #000;
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	opacity: 0;
	transition: opacity 0.2s cubic-bezier(0.4, 0, 1, 1);
	${p => p.isVisible && `
		transition: opacity 0.2s cubic-bezier(0, 0, 0.2, 1);
		opacity: 0.22;
	`}
`

// prettier-ignore
const Inner = styled(Container)<Props>`
	padding: 1.5rem 1rem 2rem;
	background: var(--color-base00);
	width: 100%;
	border-radius: 0.25rem;
	position: relative;
	bottom: 0;
	max-width: 32rem;
	box-shadow: 0 0 2rem rgba(0, 0, 0, 0.44);
	transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
	transform: translateY(60%) scale(0.8);
	opacity: 0;
	${p =>
		p.isVisible &&
		`
		transition: all 0.2s cubic-bezier(0.0, 0.0, 0.2, 1);
		opacity: 1;
		transform: translateY(0) scale(1);
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

	const exit = () => {
		if (!isVisible) return
		push(pathname, { query: '' })
	}

	useKeyPress('Escape', exit)
	return (
		<Portal>
			<Wrapper isVisible={isVisible}>
				<Backdrop isVisible={isVisible} />
				<Background
					aria-label='close modal'
					onClick={exit}
					isVisible={isVisible}
				/>
				<Inner isVisible={isVisible}>
					<Text xs={3} as='h2' weight={500}>
						Sobre COVID — BR
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						Este projeto é feito por{' '}
						<Anchor href='https://vitordino.com'>Vitor Dino</Anchor>, com seu
						código aberto no repositório{' '}
						<Anchor href='https://github.com/vitordino/covid-br'>
							<code>vitordino/covid-br</code>
						</Anchor>{' '}
						sob a{' '}
						<Anchor href='https://github.com/vitordino/covid-br/blob/master/LICENSE'>
							<code>MIT</code> License
						</Anchor>
						.
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						Os dados provém do repositório{' '}
						<Anchor href='https://github.com/wcota/covid19br'>
							<code>wcota/covid19br</code>
						</Anchor>{' '}
						com a licensa{' '}
						<Anchor
							target='_blank'
							href='https://github.com/wcota/covid19br/blob/master/LICENSE.md'
							title='Creative Commons Attribution Share Alike 4.0 International'
						>
							<code>CC BY-SA 4.0</code>
						</Anchor>
						.
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						Os dados Topográficos e Demográficos são do{' '}
						<Anchor href='https://servicodados.ibge.gov.br/api/docs/malhas?versao=2'>
							IBGE
						</Anchor>
						.
					</Text>
					<Spacer.V xs={1} />
					<Text xs={1} as='p' weight={500}>
						O ícone usado é parte do{' '}
						<Anchor href='https://fontawesome.com'>fontawesome.com</Anchor>, e
						pode ser encontrado{' '}
						<Anchor href='https://fontawesome.com/icons/shield-virus?style=solid'>
							aqui
						</Anchor>{' '}
						ele possui uma licensa{' '}
						<Anchor
							href='https://fontawesome.com/license'
							title='Creative Commons Attribution Share Alike 4.0 International'
						>
							<code>CC BY-SA 4.0</code>
						</Anchor>
						.
					</Text>
				</Inner>
			</Wrapper>
		</Portal>
	)
}

export default AboutModal
