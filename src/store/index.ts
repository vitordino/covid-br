import create from 'zustand'

type Store = {
	sort: keyof StateEntry
	setSort: (v: keyof StateEntry) => void

	dateIndex: number
	setDateIndex: (v: number) => void

	relative: boolean
	setRelative: (v: boolean) => void

	daily: boolean
	setDaily: (v: boolean) => void

	hoveredState: string | null
	setHoveredState: (v: string | null) => void
}

const [useStore] = create<Store>(set => ({
	sort: 'st',
	setSort: v => set(s => ({ sort: v })),

	dateIndex: 0,
	setDateIndex: v => set(s => ({ dateIndex: v })),

	relative: false,
	setRelative: v => set(s => ({ relative: v })),

	daily: false,
	setDaily: v => set(s => ({ daily: v })),

	hoveredState: null,
	setHoveredState: v => set(s => ({ hoveredState: v })),
}))

export default useStore
