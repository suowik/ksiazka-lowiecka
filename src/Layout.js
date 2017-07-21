import React, {Component} from "react";
import auth from "./auth/auth.js";
import Navigation from "./common/Navigation.js";

class Layout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedIn: auth.loggedIn()
        };
    }

    render() {
        return (
            <div className="container">
                <Navigation/>
                <div className="container-fluid">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Layout