export const isCityProp = (
	prop: string,
	entry: EntryUnion,
): prop is keyof CityEntry => prop in entry

export const isStateProp = (
	prop: string,
	entry: EntryUnion,
): prop is keyof StateEntry => prop in entry
