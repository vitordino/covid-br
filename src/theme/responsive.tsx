const columns: number = 16

type Breakpoint = {
	width: number
	[key: string]: any
}

export type Breakpoints = {
	[key: string]: Breakpoint
}

export type Responsive = {
	columns: number
	breakpoints: Breakpoints
}

const breakpoints: Breakpoints = {
	xs: { width: 0, gutter: 16 },
	sm: { width: 576, gutter: 24 },
	md: { width: 768, gutter: 32 },
	lg: { width: 992, gutter: 32 },
	xg: { width: 1280, gutter: 32 },
}

const responsive: Responsive = { columns, breakpoints }

export default responsive
