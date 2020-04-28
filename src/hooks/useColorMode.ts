import { useState, useLayoutEffect, Dispatch, SetStateAction } from 'react'

const KEY = 'theme:color-mode'
const getTheme = () => window.localStorage.getItem(KEY) || 'light'
const setTheme = (mode: string) => window.localStorage.setItem(KEY, mode)

type UseColorMode = () => [string, Dispatch<SetStateAction<string>>]

const useColorMode: UseColorMode = () => {
	const [colorMode, setColorMode] = useState(getTheme)

	useLayoutEffect(() => {
		setTheme(colorMode)
		document.documentElement.dataset.theme = colorMode
		// @ts-ignore
		window?.__setTheme?.(colorMode)
	}, [colorMode])

	return [colorMode, setColorMode]
}

export default useColorMode
