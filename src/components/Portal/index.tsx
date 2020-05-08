import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

type PortalProps = {
	children?: ReactNode
	root?: number
}

const Portal = ({ children, root = 1 }: PortalProps) => {
	if (typeof document === 'undefined') return null
	const rootEl = document.getElementById(`portal-root-${root}`)
	if (!rootEl) return null
	return createPortal(children, rootEl)
}

export default Portal
