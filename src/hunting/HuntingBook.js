import React, {Component} from "react";
import request from 'request';

import Hunting from "./Hunting.js";
import StartHunting from "./StartHunting.js";
import auth from '../auth/auth.js'
import globals from '../common/globals.js'


let API_URL = globals['API_URL'];

class HuntingBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            huntings: [],
            isInHunting: true
        };
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        let that = this;
        let loggedUser = auth.loggedUser();
        let token = loggedUser.token;
        let userId = loggedUser.userId;
        let requestData = {
            method: 'get',
            headers: {'x-access-token': token},
            json: true,
            url: API_URL + '/huntings'
        };
        request(requestData, (err, res, body) => {
            that.setState({
                huntings: body
            });
        });

        let findStartedHuntings = {
            method: 'get',
            headers: {'x-access-token': token},
            json: true,
            url: API_URL + '/huntings/started/' + userId
        };
        request(findStartedHuntings, (err, res, body) => {
            that.setState({
                isInHunting: body.length !== 0
            });
        })
    }

    render() {
        return (
            <div className="table-responsive">

                <table className="table table-bordered table-condensed table-striped">
                    <thead>
                    {!this.state.isInHunting &&
                    <tr>
                        <th colSpan={6}>
                            <StartHunting postCreate={this.refresh}/>
                        </th>
                    </tr>}
                    <tr>
                        <th>Myśliwy</th>
                        <th>Data i godzina rozpoczęcia</th>
                        <th>Data i godzina zakończenia</th>
                        <th>Upolowane zwierzęta</th>
                        <th>Rewir</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.huntings.map(hunting => <Hunting key={hunting._id} hunting={hunting} postCreate={this.refresh}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default HuntingBook