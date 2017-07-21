import React,{Component} from 'react';
import auth from '../auth/auth.js'

class HasRole extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roles: auth.loggedUser().roles,
            levelRequired: props.levelRequired.split(",")
        };
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

