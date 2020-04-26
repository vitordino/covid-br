import { scaleLinear } from 'd3-scale'
import { schemeOrRd } from 'd3-scale-chromatic'

import type { StateEntry } from 'components/StatesTable'

import { highestPopCase, highestStateCase } from 'data/states.json'

const POP_MULTIPLIER = 100000

const range = (n: number) => Array.from(Array(n).keys())

const getDomain = (entry: number, divisions: number = 8) => [
	1,
	...range(divisions).map(div => ((div + 1) / divisions) * entry),
]

const domains = {
	tc: getDomain(highestStateCase),
	ptc: getDomain(highestPopCase * POP_MULTIPLIER),
}

const multipliers = {
	tc: 1,
	ptc: POP_MULTIPLIER,
}

// @ts-ignore
export const colorScale = domain => scaleLinear(domain, schemeOrRd[9])

export type PropUnion = keyof typeof domains & keyof typeof multipliers

export const getMapFill = (data: StateEntry[], id: string) => (
	prop: PropUnion,
) => {
	const x = data.find(({ st }) => st === id)?.[prop]
	if (typeof x !== 'number') return '#eee'
	return colorScale(domains[prop])(x * multipliers[prop])
}
