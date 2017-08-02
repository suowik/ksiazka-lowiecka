import React, {Component} from "react";

import StartHunting from "./StartHunting.js";
import Huntings from './Huntings.js'
import auth from '../auth/auth.js'

import {protectedGet} from '../common/requests.js'

export default class HuntingBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            huntings: [],
            isInHunting: true,
            userId: auth.loggedUser().userId

        };
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        let that = this;
        let loggedUser = auth.loggedUser();
        let userId = loggedUser.userId;

        protectedGet('huntings')((err, res, body) => {
            that.setState({
                huntings: body
            });
        });
        protectedGet('/huntings/started/' + userId)((err, res, body) => {
            that.setState({
                isInHunting: body.length !== 0
            });
        });
    }

    render() {
        return (<div className="container">
            <div className="row">
                <div className="col-lg-12">
                    {!this.state.isInHunting && <StartHunting postCreate={this.refresh}/>}
                </div>
            </div>
            <div className="row">
                <div className="col-lg-12">
                    <Huntings huntings={this.state.huntings} userId={this.state.userId} renderActions={true} postHook={this.refresh}/>
                </div>
            </div>
        </div>)
    }
}