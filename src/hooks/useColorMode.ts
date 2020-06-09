import { useState, useLayoutEffect, Dispatch, SetStateAction } from 'react'

const KEY = 'theme:color-mode'
const getTheme = () => window.localStorage.getItem(KEY)
const setTheme = (mode: string) => window.localStorage.setItem(KEY, mode)

type Mode = string | null
type UseColorMode = () => [Mode, Dispatch<SetStateAction<Mode>>]

const useColorMode: UseColorMode = () => {
	const [colorMode, setColorMode] = useState<Mode>(getTheme)

	useLayoutEffect(() => {
		if (colorMode) {
			setTheme(colorMode)
			document.documentElement.dataset.theme = colorMode
			// @ts-ignore __setTheme global has no type yet
			window.__setTheme?.(colorMode)
		}
	}, [colorMode])

	return [colorMode, setColorMode]
}

export default useColorMode
