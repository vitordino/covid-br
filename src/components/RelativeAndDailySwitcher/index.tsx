import React from 'react'
import styled from 'styled-components'
import { useBreakpoints } from 'etymos'

import useStore from 'store'
import Switch from 'components/Switch'

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

const RelativeAndDailySwitcher = ({
	visibleOn = ['xs', 'sm', 'md', 'lg', 'xg'],
	controls = ['relative', 'daily'],
}: WrapperProps) => {
	const breakpoints = useBreakpoints()
	const currentBreakpoint = breakpoints[breakpoints.length - 1]
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	const isVisible = visibleOn.find(x => x === currentBreakpoint)
	if (!controls.length || !isVisible) return <></>
	return (
		<Wrapper>
			{controls.map(x => {
				if (x === 'relative')
					return (
						<Switch
							checked={relative}
							onChange={x => setRelative(x)}
							options={['Relative', 'Absolute']}
						/>
					)
				return null
			})}
		</Wrapper>
	)
}

export default RelativeAndDailySwitcher
