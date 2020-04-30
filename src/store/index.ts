import create from 'zustand'

import type { StateEntry } from 'App'

type Store = {
	sort: keyof StateEntry
	setSort: (v: keyof StateEntry) => void
}

const [useStore] = create<Store>(set => ({
	sort: 'st',
	setSort: v => set(s => ({ sort: v })),
}))

export default useStore
