import React from 'react'
import styled from 'styled-components'

import useStore from 'store'

const Wrapper = styled.label``

const RelativeSwitcher = () => {
	const [relative, setRelative] = useStore(s => [s.relative, s.setRelative])
	return (
		<Wrapper>
			{JSON.stringify({ relative })}
			<input
				type='checkbox'
				checked={relative}
				onChange={({ target }) => setRelative(target.checked)}
			/>
		</Wrapper>
	)
}

export default RelativeSwitcher
