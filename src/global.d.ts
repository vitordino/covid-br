// prettier-ignore
export enum StatesEnum { SP, MG, RJ, BA, PR, RS, PE, CE, PA, SC, MA, GO, AM, ES, PB, RN, MT, AL, PI, DF, MS, SE, RO, TO, AC, AP, RR }

export type StateEntry = {
	date: DatesEnum
	st: keyof typeof StatesEnum | 'TOTAL'
	td: number
	nd: number
	rtd: number | null
	ptd: number | null
	pnd: number | null
	tc: number
	nc: number
	rtc: number | null
	ptc: number | null
	pnc: number | null
	tr: number
	nr: number
	rtr: number | null
	ptr: number | null
	pnr: number | null
}

export type CityEntry = {
	ct?: string
	id?: number
	tc: number
	nc: number
	td: number
	nd: number
	ptd: number
	ptc: number
	dbc?: number
}

export type DateMapOf<T> = { [K in DatesEnum]: T }

export type Main = DateMapOf<StateEntry[]>
export type Totals = DateMapOf<StateEntry>
export type StateMeta = {
	p: number
	n: string
}

export type StatesMeta = {
	[K in StatesEnum]: StateMeta
}

export type ValuesOf<T extends string[]> = T[number]

export type DatesEnum = ValuesOf<typeof data.dates>
