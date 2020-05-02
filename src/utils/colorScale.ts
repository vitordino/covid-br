import { scaleLinear } from 'd3-scale'
import { schemeOrRd, schemeGreys } from 'd3-scale-chromatic'

import {
	highestStateCase,
	highestStateDeath,
	highestStateNewCase,
	highestStateNewDeath,
	highestTotalCase,
	highestTotalDeath,
	highestTotalNewCase,
	highestTotalNewDeath,
	highestPopCase,
	highestPopDeath,
	highestPopNewCase,
	highestPopNewDeath,
	highestTotalPopCase,
	highestTotalPopDeath,
	highestTotalPopNewCase,
	highestTotalPopNewDeath,
} from 'data/states.json'

const POP_MULTIPLIER = 100000

const range = (n: number) => Array.from(Array(n).keys())

const getDomain = (entry: number, divisions: number = 8) => [
	1,
	...range(divisions).map(div => ((div + 1) / divisions) * entry),
]

const domains = {
	tc: getDomain(highestStateCase),
	nc: getDomain(highestStateNewCase),
	ptc: getDomain(highestPopCase * POP_MULTIPLIER),
	pnc: getDomain(highestPopNewCase * POP_MULTIPLIER),

	td: getDomain(highestStateDeath),
	nd: getDomain(highestStateNewDeath),
	ptd: getDomain(highestPopDeath * POP_MULTIPLIER),
	pnd: getDomain(highestPopNewDeath * POP_MULTIPLIER),
}

const domainsKeys = Object.keys(domains)

const totalDomains = {
	tc: getDomain(highestTotalCase),
	nc: getDomain(highestTotalNewCase),
	ptc: getDomain(highestTotalPopCase * POP_MULTIPLIER),
	pnc: getDomain(highestTotalPopNewCase * POP_MULTIPLIER),

	td: getDomain(highestTotalDeath),
	nd: getDomain(highestTotalNewDeath),
	ptd: getDomain(highestTotalPopDeath * POP_MULTIPLIER),
	pnd: getDomain(highestTotalPopNewDeath * POP_MULTIPLIER),
} as const

const totalDomainsKeys = Object.keys(totalDomains)

const multipliers = {
	tc: 1,
	nc: 1,
	td: 1,
	nd: 1,
	ptc: POP_MULTIPLIER,
	pnc: POP_MULTIPLIER,
	ptd: POP_MULTIPLIER,
	pnd: POP_MULTIPLIER,
} as const

const multipliersKeys = Object.keys(multipliers)

const scales = {
	tc: schemeOrRd[9],
	nc: schemeOrRd[9],
	td: schemeGreys[9],
	nd: schemeGreys[9],
	ptc: schemeOrRd[9],
	pnc: schemeOrRd[9],
	ptd: schemeGreys[9],
	pnd: schemeGreys[9],
} as const

const scaleKeys = Object.keys(scales)

type IsPropSafe = (p: keyof StateEntry) => boolean

const isPropSafe: IsPropSafe = p =>
	domainsKeys.includes(p) &&
	totalDomainsKeys.includes(p) &&
	multipliersKeys.includes(p) &&
	scaleKeys.includes(p)

export type PropUnion = keyof typeof domains &
	keyof typeof totalDomains &
	keyof typeof multipliers &
	keyof typeof scales

type GetSafeProp = (
	prop: keyof StateEntry,
	fallbackProp: PropUnion,
) => PropUnion

// @ts-ignore
const getSafeProp: GetSafeProp = (prop, fallbackProp) => {
	if (isPropSafe(prop)) return prop
	return fallbackProp
}

// @ts-ignore
export const colorScale = (domain, range) => scaleLinear(domain, range)

export const getRangeFill = (data: StateEntry) => (
	prop: keyof StateEntry,
	fallbackProp: PropUnion = 'tc',
) => {
	const safeProp = getSafeProp(prop, fallbackProp)

	const x = data?.[safeProp]
	if (typeof x !== 'number') return '#eee'
	return colorScale(
		totalDomains[safeProp],
		scales[safeProp],
	)(x * multipliers[safeProp])
}

export const getMapFill = (data: StateEntry[], id?: string) => (
	prop: keyof StateEntry,
	fallbackProp: PropUnion = 'tc',
) => {
	const safeProp = getSafeProp(prop, fallbackProp)

	const x = data.find(({ st }) => st === id)?.[safeProp]
	if (typeof x !== 'number') return '#eee'
	return colorScale(
		domains[safeProp],
		scales[safeProp],
	)(x * multipliers[safeProp])
}
