import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import Layout from 'components/Layout'
import Loader from 'components/Loader'

const Home = lazy(() => import('./routes/Home')) 
const NotFound = lazy(() => import('./routes/NotFound'))

const App = () => (
	<Router>
		<Layout>
			<Suspense fallback={<Loader />}>
			<Switch>
				<Route path='/' exact>
					<Home />
				</Route>
				<Route path='*'>
					<NotFound />
				</Route>
			</Switch>
			</Suspense>
		</Layout>
	</Router>
)

export default App
