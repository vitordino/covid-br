import React from 'react'
import data from './data/total.json'

const App = () => <pre>{JSON.stringify({ data }, null, 2)}</pre>

export default App
