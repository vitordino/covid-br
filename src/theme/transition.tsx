const defaultOptions = {
	time: 0.25,
	delay: 0.125,
}

const defaultProperties = [
	'color',
	'background-color',
	'border-color',
	'box-shadow',
]

const get = (p = defaultProperties, { time, delay } = defaultOptions) => {
	if (!p?.length) return null
	if (typeof p === 'string') return `transition: ${time}s ${p} ${delay}s;`
	return `transition: ${p.map((x) => `${time}s ${x} ${delay}s`).join(', ')};`
}

const transition = { get, ...defaultOptions }

export default transition
