import { useEffect } from 'react'

type VoidReturn = () => void

const useKeyPress = (targetKey: string, fn: VoidReturn) => {
	const handler = ({ key }: { key: string }) => {
		if (key === targetKey) return fn()
	}

	useEffect(() => {
		window.addEventListener('keydown', handler)
		return () => {
			window.removeEventListener('keydown', handler)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}

export default useKeyPress
