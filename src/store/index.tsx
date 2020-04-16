import React, { ReactNode } from 'react'
import createStorage from '../hooks/context-storage'

type StoreProviderProps = { children: ReactNode }

const keys = { color: 'theme:color-mode' }

const colorModeStorage = createStorage(keys.color, 'light')
const ColorModeProvider = colorModeStorage[0]
export const useColorMode = colorModeStorage[1]

export const StoreProvider = ({ children }: StoreProviderProps) => (
	<ColorModeProvider>{children}</ColorModeProvider>
)
