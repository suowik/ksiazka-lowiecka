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
        console.log("login attempt")
    }

    render() {
        let toRender = null;
        let authorized = this.hasRole();
        if (authorized) {
            toRender = this.props.children
        }
        return (
            <div>{toRender}</div>
        )
    }

    hasRole() {
        let contains = this.state.roles.filter((role)=> {
            let isInArray = false;
            this.state.levelRequired.forEach((e)=> {
                if(e === role){
                    isInArray = true
                }
            });
            return isInArray;
        });
        return contains.length !== 0
    }
}

export default HasRole

