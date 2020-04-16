const mono =
	'"IBM Plex Mono", SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace'

type Fonts = {
	[key: string]: string
}

const fonts: Fonts = { mono }

type Unit = {
	s: number
	l: number
	c: number
}

type Scale = {
	[key: string]: Unit
}

const scale: Scale = {
	// f: font-size, l: line-height, c: letter-spacing
	'0': { s: 12, l: 16, c: 0.0 },
	'1': { s: 18, l: 20, c: 0.0 },
	'2': { s: 16, l: 24, c: 0.0 },
	'3': { s: 20, l: 40, c: 0.0 },
	'4': { s: 24, l: 40, c: 0.0 },
	'5': { s: 24, l: 48, c: 0.0 },
	'6': { s: 32, l: 40, c: 0.0 },
	'7': { s: 32, l: 48, c: 0.0 },
	'8': { s: 48, l: 64, c: 0.0 },
}

export type Typography = {
	fonts: Fonts
	scale: Scale
}

const typography: Typography = { fonts, scale }

export default typography
