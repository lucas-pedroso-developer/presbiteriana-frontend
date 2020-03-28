import React from 'react'
import RegisterUser from '../views/registerUser'
import SearchUser from '../views/searchUser'
import RegisterVisit from '../views/registerVisit'
import SearchVisit from '../views/searchVisit'
import { Route, Switch, HashRouter } from 'react-router-dom'

function Routes() {
	return (
		<HashRouter>
			<Switch>
				<Route path="/register-user/:id?" component={RegisterUser} />				
				<Route path="/search-user" component={SearchUser} />							
				<Route path="/register-visit/:id?" component={RegisterVisit} />		
				<Route path="/search-visit" component={SearchVisit} />								
			</Switch>
		</HashRouter>
	)
}

export default Routes