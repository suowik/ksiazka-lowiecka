import React, {Component} from "react";

import HuntingsTable from './HuntingsTable.js'
import auth from '../auth/auth.js'

import {protectedGet} from '../common/requests.js'

export default class HuntingBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            huntings: [],
            userId: auth.loggedUser().userId

        };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh = () => {
        let that = this;
        protectedGet('huntings')((err, res, body) => {
            that.setState({
                huntings: body
            });
        });
    };

    render() {
        return (<div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <HuntingsTable huntings={this.state.huntings}
                                   showHunter={true}
                                   userId={this.state.userId}
                                   renderActions={true}
                                   postHook={this.refresh}/>
                </div>
            </div>
        </div>)
    }
}