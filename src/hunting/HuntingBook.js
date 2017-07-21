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
            huntings: []
        };
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {
        let token = auth.loggedUser().token;
        let requestData = {
            method: 'get',
            headers: {'x-access-token': token},
            json: true,
            url: API_URL + '/huntings'
        };
        let that = this;
        request(requestData, (err, res, body) => {
            that.setState({
                huntings: body
            });
        })
    }

    render() {
        return (
            <div className="table-responsive">

                <table className="table table-bordered table-condensed table-striped">
                    <thead>
                    <tr>
                        <th colSpan={6}>
                            <StartHunting postCreate={this.refresh}/>
                        </th>
                    </tr>
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
                    {this.state.huntings.map(hunting => <Hunting key={hunting._id} hunting={hunting}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default HuntingBook