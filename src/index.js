import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router'
import Login from './auth/Login.js'
import Logout from './auth/Logout.js'
import Layout from './Layout.js'
import Register from './register/Register.js'

import HuntingBook from './hunting/HuntingBook.js'
import HuntingAreas from './huntingAreas/HuntingAreas.js'
import Animals from './animals/Animals.js'
import Users from './users/Users.js'

import auth from './auth/auth.js';

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        })
    }
}

class Routes extends Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Layout} onEnter={requireAuth}>
                    <IndexRoute component={HuntingBook} />
                    <Route path="/book" component={HuntingBook} />
                    <Route path="/book/me" component={HuntingBook} />
                </Route>
                <Route path="/areas" component={Layout}>
                    <IndexRoute component={HuntingAreas} />
                </Route>

                <Route path="/animals" component={Layout}>
                    <IndexRoute component={Animals} />
                </Route>
                <Route path="/users" component={Layout}>
                    <IndexRoute component={Users} />
                </Route>

                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
            </Router>
        )
    }
}

ReactDOM.render(
    <Routes />,
    document.getElementById('root')
);