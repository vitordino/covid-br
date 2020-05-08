import React from 'react'
import styled from 'styled-components'

import Container from 'components/Container'
import Text from 'components/Text'

const Wrapper = styled(Container)`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10rem 0;
`

const NotFound = () => (
	<Wrapper>
		<Text xs={6} weight={600}>
			404
		</Text>
	</Wrapper>
)

export default NotFound
