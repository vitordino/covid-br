import type { Theme, TypoEnum } from 'theme'

type GetTypeStyle = (name: TypoEnum) => ({ theme }: { theme: Theme }) => string

const getTypeStyle: GetTypeStyle = name => ({ theme }) => {
	const { s, l, c } = theme.type.scale?.[name] || {}
	return [
		s && `font-size: ${s}px`,
		l && `line-height: ${l}px`,
		c && `letter-spacing: ${c}px`,
	]
		.filter(x => !!x)
		.join(';\n')
}

export default getTypeStyle
