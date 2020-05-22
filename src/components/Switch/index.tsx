import React from 'react'
import styled, { css } from 'styled-components'

import Text from 'components/Text'

// prettier-ignore
const SwitchWrapper = styled.label`
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
	${p => p.theme.above('md')`border-radius: 0.25rem;`}
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
	${SwitchWrapper}:hover & {
		color: var(--color-base66);
    ${p => p.active && css`
      color: var(--color-base03);
    `}
	}
`

type SwitchProps = {
	checked: boolean
	onChange: (v: boolean) => void
	options: [string?, string?]
	isVisible?: boolean
}

const Switch = ({
	checked,
	onChange,
	options = [],
}: SwitchProps) => (
	<SwitchWrapper>
		<input
			type='checkbox'
			checked={checked}
			onChange={({ target }) => onChange(target.checked)}
		/>
		<Option active={!checked} weight={500} xs={1}>
			{options[0]}
		</Option>
		<Option xs={1}>&nbsp; / &nbsp;</Option>
		<Option active={checked} weight={500} xs={1}>
			{options[1]}
		</Option>
	</SwitchWrapper>
)

export default Switch