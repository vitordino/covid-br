import React, { StrictMode } from 'react'
import { hydrate, render } from 'react-dom'
import App from 'App'
import * as serviceWorker from 'serviceWorker'

const ToRender = () => (
	<StrictMode>
		<App />
	</StrictMode>
)

const rootElement = document.getElementById('root')
if (rootElement?.hasChildNodes()) hydrate(<ToRender />, rootElement)
if (!rootElement?.hasChildNodes()) render(<ToRender />, rootElement)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
