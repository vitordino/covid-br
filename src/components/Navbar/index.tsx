import React from 'react'
import styled from 'styled-components'

import Container from 'components/Container'
import Spacer from 'components/Spacer'
import Text from 'components/Text'
import Logo from 'components/Logo'
import ColorModeSwitcher from 'components/Layout/ColorModeSwitcher'

const Wrapper = styled(Container)`
	display: flex;
	align-items: center;
	padding-top: 1rem;
	padding-bottom: 1rem;
	color: var(--color-base88);
	svg {
		display: block;
		height: 1.5rem;
	}
	${p => p.theme.above('md')`
    padding-top: 2rem;
    padding-bottom: 2rem;
    svg {
      height: 2rem;
    }
  `}
`

const Separator = styled.div`
	flex: 1;
`

const Navbar = () => {
	return (
		<Wrapper as='nav'>
			<Spacer.H xs={0.5} />
			<Logo />
			<Spacer.H xs={0.5} />
			<Text weight={600} xs={2} md={3}>
				COVID — BR
			</Text>
			<Separator />
			<ColorModeSwitcher />
		</Wrapper>
	)
}

export default Navbar
