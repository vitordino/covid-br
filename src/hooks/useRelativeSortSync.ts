import { useEffect } from 'react'
import useStore from 'store'

type OptionalKey<T> = keyof T | undefined

type KeyToKey<T> = {
	[K in keyof T]?: keyof T
}

const absoluteToRelative: KeyToKey<StateEntry> = {
	tc: 'ptc',
	nc: 'pnc',
	td: 'ptd',
	nd: 'pnd',
	tr: 'ptr',
	nr: 'pnr',
}

const relativeToAbsolute: KeyToKey<StateEntry> = {
	ptc: 'tc',
	pnc: 'nc',
	ptd: 'td',
	pnd: 'nd',
	ptr: 'tr',
	pnr: 'nr',
}

const transposeKeys: KeyToKey<StateEntry> = {
	...absoluteToRelative,
	...relativeToAbsolute,
} as const

const getNextSort = (sort: keyof typeof transposeKeys, relative: boolean) => {
	if (relative && absoluteToRelative[sort]) return absoluteToRelative[sort]
	if (!relative && relativeToAbsolute[sort]) return relativeToAbsolute[sort]
	return null
}

const useRelativeSortSync = () => {
	const relative = useStore(s => s.relative)
	const [sort, setSort] = useStore(s => [s.sort, s.setSort])

	const nextSort = getNextSort(sort, relative) || 'tc'

	useEffect(() => {
		setSort(nextSort)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [relative])
	return null
}

export default useRelativeSortSync
