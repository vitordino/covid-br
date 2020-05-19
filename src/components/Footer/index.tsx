import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import Container from 'components/Container'
import Spacer from 'components/Spacer'
import Text from 'components/Text'
import Logo from 'components/Logo'

const LogoLink = styled(Link)`
	display: flex;
	align-items: center;
`

const Wrapper = styled(Container)`
	display: flex;
	align-items: center;
	width: 100%;
	padding-top: 3rem;
	padding-bottom: 3rem;
	color: var(--color-base88);
	svg {
		display: block;
		height: 1rem;
	}
	${p => p.theme.above('md')`
    padding-top: 4rem;
    padding-bottom: 4rem;
    svg {
      height: 1.5rem;
    }
  `}
`

const Separator = styled.div`
	flex: 1;
`

const Footer = () => (
	<Wrapper as='footer'>
		<LogoLink to='/'>
			<Spacer.H xs={0.5} />
			<Logo />
			<Spacer.H xs={0.5} />
			<Text weight={600} xs={1} md={2}>
				COVID — BR
			</Text>
			<Spacer.H xs={0.5} />
		</LogoLink>
		<Separator />
		<Text as={Link} to='?about' weight={500} xs={1} md={2}>
			About
		</Text>
	</Wrapper>
)

export default Footer
