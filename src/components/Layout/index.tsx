import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { ThemeProvider } from 'theme'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import AboutModal from 'components/AboutModal'
import GlobalStyle from 'components/Layout/GlobalStyle'

const Main = styled.main`
	flex: 1;
`

type LayoutProps = {
	children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => (
	<ThemeProvider>
		<>
			<GlobalStyle />
			<Navbar />
			<Main>{children}</Main>
			<Footer />
			<AboutModal />
		</>
	</ThemeProvider>
)

export default Layout
