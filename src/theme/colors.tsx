import { mix } from 'polished'

const base = {
	light: '#0A0B0E',
	dark: '#FFFFFF',
}

type ColorMode = {
	[key: string]: string
}

export type ColorModes = {
	[key: string]: ColorMode
}

const light: ColorMode = {
	base: base.light,
	base88: mix(0.88, base.light, base.dark),
	base66: mix(0.66, base.light, base.dark),
	base44: mix(0.44, base.light, base.dark),
	base22: mix(0.22, base.light, base.dark),
	base11: mix(0.11, base.light, base.dark),
	base06: mix(0.06, base.light, base.dark),
	base03: mix(0.03, base.light, base.dark),
	base00: mix(0.0, base.light, base.dark),
}

const dark: ColorMode = {
	base: base.dark,
	base88: mix(0.88, base.dark, base.light),
	base66: mix(0.66, base.dark, base.light),
	base44: mix(0.44, base.dark, base.light),
	base22: mix(0.22, base.dark, base.light),
	base11: mix(0.11, base.dark, base.light),
	base06: mix(0.06, base.dark, base.light),
	base03: mix(0.03, base.dark, base.light),
	base00: mix(0.0, base.dark, base.light),
}

const colors: ColorModes = { light, dark }

export default colors
