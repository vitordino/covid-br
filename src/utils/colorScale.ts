import { scaleLinear } from 'd3-scale'
import { schemeReds, schemeGreys, schemeGreens } from 'd3-scale-chromatic'

import {
	highestStateCase,
	highestStateNewCase,
	highestTotalCase,
	highestPopCase,
	highestPopNewCase,
	highestTotalNewCase,
	highestTotalPopCase,
	highestTotalPopNewCase,
	highestStateDeath,
	highestStateNewDeath,
	highestTotalDeath,
	highestTotalNewDeath,
	highestPopDeath,
	highestPopNewDeath,
	highestTotalPopDeath,
	highestTotalPopNewDeath,
	highestStateRecovered,
	highestStateNewRecovered,
	highestTotalRecovered,
	highestTotalNewRecovered,
	highestPopRecovered,
	highestPopNewRecovered,
	highestTotalPopRecovered,
	highestTotalPopNewRecovered,
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

	tr: getDomain(highestStateRecovered),
	nr: getDomain(highestStateNewRecovered),
	ptr: getDomain(highestPopRecovered * POP_MULTIPLIER),
	pnr: getDomain(highestPopNewRecovered * POP_MULTIPLIER),
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

	tr: getDomain(highestTotalRecovered),
	nr: getDomain(highestTotalNewRecovered),
	ptr: getDomain(highestTotalPopRecovered * POP_MULTIPLIER),
	pnr: getDomain(highestTotalPopNewRecovered * POP_MULTIPLIER),
} as const

const totalDomainsKeys = Object.keys(totalDomains)

const multipliers = {
	tc: 1,
	nc: 1,
	ptc: POP_MULTIPLIER,
	pnc: POP_MULTIPLIER,
	td: 1,
	nd: 1,
	ptd: POP_MULTIPLIER,
	pnd: POP_MULTIPLIER,
	tr: 1,
	nr: 1,
	ptr: POP_MULTIPLIER,
	pnr: POP_MULTIPLIER,
} as const

const multipliersKeys = Object.keys(multipliers)

const scales = {
	tc: schemeReds[9],
	nc: schemeReds[9],
	ptc: schemeReds[9],
	pnc: schemeReds[9],
	td: schemeGreys[9],
	nd: schemeGreys[9],
	ptd: schemeGreys[9],
	pnd: schemeGreys[9],
	tr: schemeGreens[9],
	nr: schemeGreens[9],
	ptr: schemeGreens[9],
	pnr: schemeGreens[9],
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
