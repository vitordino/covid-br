import styled from 'styled-components'

const Container = styled.div`
	padding-left: 0.5rem;
	padding-right: 0.5rem;
	max-width: 80rem;
	margin: 0 auto;
	${p => p.theme.above('sm')`
		padding-left: 1rem;
		padding-right: 1rem;
	`}
	${p => p.theme.above('md')`
		padding-left: 2rem;
		padding-right: 2rem;
	`}
	${p => p.theme.above('lg')`
		padding-left: 2.5rem;
		padding-right: 2.5rem;
	`}
`

export default Container
