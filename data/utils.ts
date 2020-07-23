export const MULTIPLIER = 100000

export const convertDateString = (s: string) => parseInt(s.replace(/-/g, ''))

export const compareDates = (a: string, b: string) =>
	convertDateString(b) > convertDateString(a) ? b : a

export const getLatestDate = (dates: string[]) =>
	dates.reduce(compareDates, '0')
