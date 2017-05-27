import React, {Component} from 'react';
import { Link } from 'react-router'
import auth from './auth/auth.js'

class Layout extends Component {

    constructor(props){
        super(props);
        this.state = {
            loggedIn: auth.loggedIn()
        };
        this.updateAuth = this.updateAuth.bind(this);
    }

    updateAuth(loggedIn) {
        this.setState({
            loggedIn
        })
    }

    componentWillMount() {
        auth.onChange = this.updateAuth;
        auth.login()
    }

    render() {
        return (
            <div>
                {this.props.children}
                <br/>
                <br/>
                <br/>
                <div className="row hidden-print">
                    <div className="col-sm-12">
                        <Link to="/" className="btn btn-sm btn-success btn-block">Powrót</Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Layout