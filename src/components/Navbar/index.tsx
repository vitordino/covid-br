import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import useStore from 'store'
import { getColorOf } from 'utils/colorScale'
import Container from 'components/Container'
import Spacer from 'components/Spacer'
import Text from 'components/Text'
import Logo from 'components/Logo'
import ColorModeSwitcher from 'components/Layout/ColorModeSwitcher'

type WrapperProps = {
	sort: string
}

const LogoLink = styled(Link)`
	display: flex;
	align-items: center;
`

const Wrapper = styled(Container)<WrapperProps>`
	display: flex;
	align-items: center;
	width: 100%;
	padding-top: 1rem;
	padding-bottom: 1rem;
	color: var(--color-base88);
	color: ${({ sort }) => getColorOf(sort, 5)};
	${p => p.theme.above('md')`
    padding-top: 2rem;
    padding-bottom: 2rem;
  `}
`

const Separator = styled.div`
	flex: 1;
`

const Navbar = () => {
	const sort = useStore(s => s.sort)
	return (
		<Wrapper as='nav' sort={sort}>
			<LogoLink to='/'>
				<Spacer.H xs={0.5} />
				<Logo xs={1.5} md={2} />
				<Spacer.H xs={0.5} />
				<Text weight={600} xs={2} md={3}>
					COVID — BR
				</Text>
				<Spacer.H xs={0.5} />
			</LogoLink>
			<Separator />
			<ColorModeSwitcher />
		</Wrapper>
	)
}

export default Navbar
