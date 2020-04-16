import React, { ReactNode } from 'react'

import { ThemeProvider } from '../../theme'
import SEO from './SEO'
import GlobalStyle from './GlobalStyle'

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
				{children}
			</>
		</ThemeProvider>
	)
}

export default Layout