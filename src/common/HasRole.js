import React,{Component} from 'react';
import auth from '../auth/auth.js'

class HasRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roles: auth.roles().split(","),
            levelRequired: props.levelRequired.split(",")
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
        auth.login();
    }

    render() {
        if (!this.authorized()) {
            return null;
        }
        return (
            React.Children.only(this.props.children)
        )
    }

    authorized() {
        return this.state.roles.some(role => this.state.levelRequired.some(e => e === role));
    }
}

export default HasRole

