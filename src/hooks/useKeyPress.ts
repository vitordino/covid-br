import { useEffect, useCallback } from 'react'

type VoidReturn = () => void

const useKeyPress = (targetKey: string, fn: VoidReturn) => {
	const handler = useCallback(
		({ key }: { key: string }) => {
			if (key === targetKey) return fn()
		},
		[targetKey, fn],
	)

	useEffect(() => {
		window.addEventListener('keydown', handler)
		return () => {
			window.removeEventListener('keydown', handler)
		}
	}, [handler, targetKey, fn])
}

export default useKeyPress
