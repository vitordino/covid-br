import React, { createContext, useContext, useState, useEffect } from 'react'

type StateHook<V> = () => [V | undefined, (v: V) => void]

/* istanbul ignore next */
/* prettier-ignore */
const noop = () => {/* noop */}

const hasStorage = typeof localStorage !== 'undefined'
const defaultStorage = {
	getItem: (key: string) => (hasStorage ? localStorage.getItem(key) : null),
	setItem: (key: string, value: string) => {
		if (hasStorage) localStorage.setItem(key, value)
	},
}

export default function createStorage<V>(
	key: string,
	fallbackValue?: V,
	parse?: () => any,
	stringify?: () => any,
	storage: typeof defaultStorage = defaultStorage,
): [React.FunctionComponent, StateHook<V>] {
	const storedValue: V = JSON.parse(storage.getItem(key) || 'null', parse)
	const initialValue = storedValue != null ? storedValue : fallbackValue

	const ValueContext = createContext(initialValue)
	const SetterContext = createContext(noop)
	const useStorage: StateHook<V> = () => [
		useContext(ValueContext),
		useContext(SetterContext),
	]

	const Provider: React.FunctionComponent = ({ children }) => {
		const [value, setValue] = useState(initialValue)

		useEffect(() => {
			storage.setItem(key, JSON.stringify(value, stringify))
		}, [value])

		return (
			<ValueContext.Provider value={value}>
				<SetterContext.Provider value={setValue as () => void}>
					{children}
				</SetterContext.Provider>
			</ValueContext.Provider>
		)
	}

	return [Provider, useStorage]
}
