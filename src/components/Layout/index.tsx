import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { ThemeProvider } from 'theme'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'
import SEO from 'components/Layout/SEO'
import AboutModal from 'components/AboutModal'
import GlobalStyle from 'components/Layout/GlobalStyle'

const Main = styled.main`
	flex: 1;
`

type LayoutProps = {
	children?: ReactNode
	title?: string
	description?: string
	lang?: string
	image?: string
	tags?: string[]
}

const Layout = ({
	children,
	title,
	description,
	lang,
	image,
	tags,
}: LayoutProps) => {
	const meta = { title, description, image, tags }

	return (
		<ThemeProvider>
			<>
				<SEO {...meta} lang={lang} />
				<GlobalStyle />
				<Navbar />
				<Main>{children}</Main>
				<Footer />
				<AboutModal />
			</>
		</ThemeProvider>
	)
}

export default Layout
