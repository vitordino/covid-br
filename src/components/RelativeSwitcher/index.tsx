import React from 'react'
import styled, { css } from 'styled-components'

import useStore from 'store'
import Text from 'components/Text'

const Wrapper = styled.label`
	position: sticky;
	top: 0.25rem;
	display: flex;
	background: var(--color-base06);
	padding: 0.5rem 0.75rem;
	border-radius: 0.25rem;
	box-shadow: 0 0 0 0.25rem var(--color-base00);
	&:hover {
		background: var(--color-base);
		color: var(--color-base00);
	}
`

type OptionProps = {
	active?: boolean
}

// prettier-ignore
const Option = styled(Text)<OptionProps>`
	color: var(--color-base44);
	${p => p.active && css`
    color: var(--color-base88);
  `}
	${Wrapper}:hover & {
		color: var(--color-base66);
    ${p => p.active && css`
      color: var(--color-base03);
    `}
	}
`

const RelativeSwitcher = () => {
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	return (
		<Wrapper>
			<input
				type='checkbox'
				checked={relative}
				onChange={({ target }) => setRelative(target.checked)}
			/>
			<Option active={!relative} weight={500} xs={1}>
				Absolute
			</Option>
			<Option xs={1}>&nbsp; / &nbsp;</Option>
			<Option active={relative} weight={500} xs={1}>
				Relative
			</Option>
		</Wrapper>
	)
}

export default RelativeSwitcher
