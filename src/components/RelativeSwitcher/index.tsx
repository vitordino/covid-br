import React from 'react'
import styled, { css } from 'styled-components'

import useStore from 'store'
import Text from 'components/Text'

type WrapperProps = {
	desktop?: boolean
}

const Wrapper = styled.label<WrapperProps>`
	position: sticky;
	top: 0.25rem;
	display: flex;
	cursor: pointer;
	background: var(--color-base06);
	padding: 0.5rem 0.75rem;
	border-radius: 0.25rem 0.25rem 0 0;
	box-shadow: 0 0 0 0.25rem var(--color-base00);
	margin: 0 0.375rem 0.25rem -0.125rem;
	z-index: 100;
	&:hover {
		background: var(--color-base);
		color: var(--color-base00);
	}
	${p => p.theme.above('md')`
    display: none;
    border-radius: 0.25rem;
    margin: 0;
  `}
	${p =>
		p.desktop &&
		css`
			display: none;
			${p.theme.above('md')`
      display: flex;
    `}
		`}
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

const RelativeSwitcher = (props: WrapperProps) => {
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	return (
		<Wrapper {...props}>
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
