import React from 'react';
import auth from './auth.js'
import { withRouter } from 'react-router'
import Header from './../common/Header.js'

const Login = withRouter(
    React.createClass({

        getInitialState() {
            return {
                error: false
            }
        },

        handleSubmit(event) {
            event.preventDefault();

            const email = this.refs.email.value;
            const pass = this.refs.pass.value;

            auth.login(email, pass, (loggedIn) => {
                if (!loggedIn)
                    return this.setState({error: true});

                const { location } = this.props;

                if (location.state && location.state.nextPathname) {
                    this.props.router.replace(location.state.nextPathname)
                } else {
                    this.props.router.replace('/')
                }
            })
        },

        render() {
            return (
                <div>
                    <Header title={`Zaloguj się`} subtitle={``}/>

                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label><input ref="email" placeholder="login" className="form-control"/></label>
                        </div>
                        <div className="form-group">
                            <label><input ref="pass" placeholder="hasło" className="form-control"/></label>
                        </div>
                        <button type="submit" className="btn btn-sm btn-success">Zaloguj</button>
                        {this.state.error && (
                            <p>Błędne dane</p>
                        )}
                    </form>
                </div>
            )
        }
    })
);

export default Login