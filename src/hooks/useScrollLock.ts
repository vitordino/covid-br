import { useLayoutEffect } from 'react'

const useScrollLock = (condition = false) => {
	useLayoutEffect(() => {
    const html = document.documentElement
    const original = window.getComputedStyle(html).overflow
		if (condition) {
			html.style.overflow = 'hidden'
		}
    return () => {
      html.style.overflow = original
    }
	}, [condition])
}

export default useScrollLock