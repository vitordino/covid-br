import React from 'react'
import styled from 'styled-components'

import Container from 'components/Container'
import SEO from 'components/SEO'
import Spacer from 'components/Spacer'
import Text from 'components/Text'

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-top: 10rem;
	padding-bottom: 10rem;
`

const NotFound = () => (
	<Wrapper>
		<SEO title='404' />
		<Text xs={6} weight={600}>
			404
		</Text>
		<Spacer.V xs={1} />
		<Text xs={4} weight={500}>
			Página não encontrada
		</Text>
	</Wrapper>
)

export default NotFound
