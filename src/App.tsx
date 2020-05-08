import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Home from 'routes/Home'
import NotFound from 'routes/NotFound'
import Layout from 'components/Layout'

const App = () => (
	<Router>
		<Layout>
			<Switch>
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='*'>
					<NotFound />
				</Route>
			</Switch>
		</Layout>
	</Router>
)

export default App
