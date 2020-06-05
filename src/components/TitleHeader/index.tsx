import React, { ReactNode } from 'react'
import styled from 'styled-components'

import Text from 'components/Text'

type TitleHeaderProps = {
	title: ReactNode
	options: string[]
	value: string
	renderOption: (value: string) => string
	onChange: (value: string) => void
}

const Wrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	padding: 0 0.5rem 1rem;
`

const SelectLabel = styled(Text)`
	display: flex;
	&:after {
		display: block;
		right: 0;
		margin-left: 0.5em;
		transform: rotate(90deg);
		content: '›';
	}
`

const TitleHeader = ({
	title = null,
	options = [],
	renderOption = x => x,
	value,
	onChange,
}: TitleHeaderProps) => (
	<Wrapper>
		{title && (
			<Text as='h1' weight={400} xs={3} md={4} lg={5} style={{ flex: 1 }}>
				{title}
			</Text>
		)}
		<SelectLabel as='label' weight={400} xs={2} md={3}>
			<select
				aria-label='date picker'
				value={value}
				onChange={({ target }) => onChange(target.value)}
			>
				{options.map((x, i) => (
					<option key={x} value={i}>
						{renderOption(x)}
					</option>
				))}
			</select>
		</SelectLabel>
	</Wrapper>
)

export default TitleHeader
