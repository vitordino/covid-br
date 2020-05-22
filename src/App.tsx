import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import statesMeta from 'data/statesMeta.json'
import Layout from 'components/Layout'
import Loader from 'components/Loader'

const Home = lazy(() => import('./routes/Home'))
const State = lazy(() => import('./routes/State'))
const NotFound = lazy(() => import('./routes/NotFound'))

const App = () => (
	<Router>
		<Layout>
			<Suspense fallback={<Loader />}>
				<Switch>
					<Route path='/' exact>
						<Home />
					</Route>
					<Route path='/:id' exact>
						{({ match }) => {
							const id: string | null = match?.params?.id
							if (!id || !(id.toUpperCase() in statesMeta)) return <NotFound />
							return <State id={match?.params?.id.toUpperCase()} />
						}}
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
