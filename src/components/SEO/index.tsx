import React from 'react'
import { Helmet } from 'react-helmet'

const siteMetadata = {
	siteUrl: 'https://covid.vitordino.com/',
	author: 'vitordino',
	title: 'COVID — BR',
	description: 'Mapa da Covid-19 no Brasil, com dados de estados e municípios',
	keywords: ['covid19', 'coronavirus', 'brazil', 'brasil'],
	image: 'https://covid.vitordino.com/og-image.png',
}

type Meta = {
	name: string
	content: string
}

type SEOProps = {
	title?: string
	description?: string
	lang?: string | undefined
	meta?: Meta[]
	tags?: string[]
	image?: string
	titleTemplate?: string
}

const SEO = ({
	title,
	description,
	lang = 'en',
	meta = [],
	tags,
	image,
	titleTemplate,
}: SEOProps) => {
	const { siteUrl, author } = siteMetadata
	const currentDescription = description || siteMetadata.description
	const currentTitle = title || siteMetadata.title
	const currentImage = image || siteMetadata.image
	const defaultTitleTemplate = title
		? `%s ⠿ ${siteMetadata.title}`
		: siteMetadata.title

	const metaTags = tags || siteMetadata.keywords

	const tagsObject =
		metaTags?.length > 0
			? { name: `keywords`, content: metaTags.join(`, `) }
			: {}

	return (
		<Helmet
			htmlAttributes={{ lang: lang.split('-')[0].split('_')[0] }}
			title={currentTitle}
			titleTemplate={titleTemplate || defaultTitleTemplate}
			meta={[
				{
					name: `description`,
					content: currentDescription,
				},
				{
					property: `og:url`,
					content: siteUrl,
				},
				{
					property: `og:site_name`,
					content: currentTitle,
				},
				{
					property: `og:title`,
					content: currentTitle,
				},
				{
					property: `og:description`,
					content: currentDescription,
				},
				{
					property: `og:type`,
					content: `website`,
				},
				{
					property: `og:image`,
					content: `${siteUrl}${currentImage}`,
				},
				{
					name: `twitter:card`,
					content: `summary_large_image`,
				},
				{
					name: `twitter:image`,
					content: `${siteUrl}${currentImage}`,
				},
				{
					name: `twitter:site`,
					content: author,
				},
				{
					name: `twitter:creator`,
					content: author,
				},
				{
					name: `twitter:title`,
					content: currentTitle,
				},
				{
					name: `twitter:description`,
					content: currentDescription,
				},
				tagsObject,
				...meta,
			]}
		/>
	)
}

export default SEO
