import { scaleLinear } from 'd3-scale'
import { schemeReds, schemeGreys, schemeGreens } from 'd3-scale-chromatic'
import { values } from 'ramda'

import range from 'utils/range'

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
} from 'data/numbers.json'

const POP_MULTIPLIER = 100000

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

export const scales = {
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
const colorScale = (domain, range) => scaleLinear(domain, range)

const higher = (a: number, b: number) => Math.max(a, b)

const defaultFilter = (x: any) => !!x

type GetHighestType = (
	filter?: (x: any) => boolean,
) => (prop: keyof EntryUnion) => (x: EntryArrayUnion) => number

const getHighest: GetHighestType = (filter = defaultFilter) => prop => x =>
	+values(x)
		.filter(filter)
		// @ts-ignore
		.filter(x => !!x?.[prop])
		// @ts-ignore
		.map(x => x?.[prop])
		.reduce(higher, 0)
		.toFixed(6)

type GetRangeFill = (
	data: EntryArrayUnion,
) => (prop: string, fallbackProp?: string) => (entry: EntryUnion) => string

export const getRangeFill: GetRangeFill = data => prop => entry => {
	// @ts-ignore
	const safeProp = getSafeProp(prop, 'tc')

	// @ts-ignore
	const x = entry?.[safeProp]
	if (typeof x !== 'number') return '#eee'

	// @ts-ignore
	const highest = getHighest()(safeProp)(data)

	return colorScale(
		getDomain(highest * multipliers[safeProp]),
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

type GetColorOfType = (p: keyof StateEntry, n?: number) => string
// @ts-ignore
export const getColorOf: GetColorOfType = (p, n = 4) => scales?.[p]?.[n]
