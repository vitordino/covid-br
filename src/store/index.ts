import create from 'zustand'

type Store = {
	sort: keyof StateEntry
	setSort: (v: keyof StateEntry) => void

	hoveredState: keyof typeof StatesEnum | null
	setHoveredState: (v: keyof typeof StatesEnum | null) => void
}

const [useStore] = create<Store>(set => ({
	sort: 'st',
	setSort: v => set(s => ({ sort: v })),

	hoveredState: null,
	setHoveredState: v => set(s => ({ hoveredState: v })),
}))

export default useStore
