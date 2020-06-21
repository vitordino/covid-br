// prettier-ignore
enum StatesEnum { SP, MG, RJ, BA, PR, RS, PE, CE, PA, SC, MA, GO, AM, ES, PB, RN, MT, AL, PI, DF, MS, SE, RO, TO, AC, AP, RR }

type StateEntry = {
	date: string
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

type CityEntry = {
	date: string
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

type EntryUnion = StateEntry | CityEntry
type EntryArrayUnion = (StateEntry | CityEntry)[]

type StateMeta = {
	p: number
	n: string
}

type StatesMeta = {
	[K in StatesEnum]: StateMeta
}

type ValuesOf<T extends string[]> = T[number]

type string = ValuesOf<typeof data.dates>
