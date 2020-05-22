import React from 'react'
import styled, { css } from 'styled-components'
import { useBreakpoints } from 'etymos'

import useStore from 'store'
import Text from 'components/Text'

type WrapperProps = {
	visibleOn?: string[]
	controls?: string[]
}

// prettier-ignore
const Wrapper = styled.div`
	position: sticky;
	top: 0.25rem;
	display: flex;
	margin: 0 0.375rem 0.25rem -0.125rem;
	z-index: 100;
	background: var(--color-base00);
	${p => p.theme.above('md')`
    border-radius: 0.25rem;
  `}
	${p => p.theme.above('lg')`
    margin: 0;
  `}
`

type EachWrapperProps = {
	isVisible?: boolean
}

// prettier-ignore
const EachWrapper = styled.label<EachWrapperProps>`
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
	${p => !p.isVisible && `display: none;`}
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
	${EachWrapper}:hover & {
		color: var(--color-base66);
    ${p => p.active && css`
      color: var(--color-base03);
    `}
	}
`

type EachProps = {
	checked: boolean
	onChange: (v: boolean) => void
	options: [string?, string?]
	isVisible?: boolean
}

const Each = ({
	checked,
	onChange,
	options = [],
	isVisible = true,
}: EachProps) => (
	<EachWrapper isVisible={isVisible}>
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
	</EachWrapper>
)

const RelativeAndDailySwitcher = ({
	visibleOn = ['xs', 'sm', 'md', 'lg', 'xg'],
	controls = ['relative', 'daily'],
}: WrapperProps) => {
	const breakpoints = useBreakpoints()
	const currentBreakpoint = breakpoints[breakpoints.length - 1]
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	const [daily, setDaily] = useStore(s => [s.daily, s.setDaily])
	const isVisible = visibleOn.find(x => x === currentBreakpoint)
	if (!controls.length || !isVisible) return <></>
	return (
		<Wrapper>
			{controls.map(x => {
				if (x === 'relative')
					return (
						<Each
							checked={!relative}
							onChange={x => setRelative(!x)}
							options={['Absolute', 'Relative']}
						/>
					)
				if (x === 'daily')
					return (
						<Each
							checked={daily}
							onChange={setDaily}
							options={['Total', 'New']}
							isVisible={!breakpoints.includes('md')}
						/>
					)
				return null
			})}
		</Wrapper>
	)
}

export default RelativeAndDailySwitcher
