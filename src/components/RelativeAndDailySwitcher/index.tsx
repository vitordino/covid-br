import React from 'react'
import styled, { css } from 'styled-components'

import useStore from 'store'
import Text from 'components/Text'

type WrapperProps = {
	desktop?: boolean
}

// prettier-ignore
const Wrapper = styled.div<WrapperProps>`
	position: sticky;
	top: 0.25rem;
	display: flex;
	margin: 0 0.375rem 0.25rem -0.125rem;
	z-index: 100;
	background: var(--color-base00);
	${p => p.theme.above('md')`
    display: none;
    border-radius: 0.25rem;
    margin: 0;
  `}
	${p => p.desktop && css`
		display: none;
		${p.theme.above('md')`
			display: flex;
		`}
	`}
`

// prettier-ignore
const Each = styled.label<WrapperProps>`
	display: flex;
	flex: 1;
	cursor: pointer;
	background: var(--color-base06);
	padding: 0.5rem 0.75rem;
	border-radius: 0.25rem 0.25rem 0 0;
	box-shadow: 0 0 0 0.25rem var(--color-base00);
	&:hover {
		background: var(--color-base);
		color: var(--color-base00);
	}
	${p => p.theme.above('md')`
    border-radius: 0.25rem;
  `}
	${p => !p.desktop && p.theme.above('md')`
		display: none;
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
	${Each}:hover & {
		color: var(--color-base66);
    ${p => p.active && css`
      color: var(--color-base03);
    `}
	}
`

const RelativeAndDailySwitcher = (props: WrapperProps) => {
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	const [daily, setDaily] = useStore(s => [s.daily, s.setDaily])
	return (
		<Wrapper {...props}>
			<Each {...props}>
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
			</Each>
			<Each desktop={false}>
				<input
					type='checkbox'
					checked={daily}
					onChange={({ target }) => setDaily(target.checked)}
				/>
				<Option active={!daily} weight={500} xs={1}>
					Total
				</Option>
				<Option xs={1}>&nbsp; / &nbsp;</Option>
				<Option active={daily} weight={500} xs={1}>
					New
				</Option>
			</Each>
		</Wrapper>
	)
}

export default RelativeAndDailySwitcher
