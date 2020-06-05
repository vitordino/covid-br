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

const initialState = {
	sort: 'tc',
	dateIndex: 0,
	relative: false,
	daily: false,
	hoveredState: null,
} as const

const [useStore] = create<Store>(set => ({
	...initialState,
	setSort: v => set({ sort: v }),
	setDateIndex: v => set({ dateIndex: v }),
	setRelative: v => set({ relative: v }),
	setDaily: v => set({ daily: v }),
	setHoveredState: v => set({ hoveredState: v }),
	reset: () => set(initialState),
}))

export default useStore
