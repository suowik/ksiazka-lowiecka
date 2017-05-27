import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import Login from './auth/Login.js'
import Logout from './auth/Logout.js'
import Layout from './Layout.js'
import auth from './auth/auth.js'

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

class Routes extends Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path="/"component={Layout}  onEnter={requireAuth}>

                </Route>
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