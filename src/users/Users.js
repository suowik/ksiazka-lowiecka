import React, {Component} from 'react';
import {protectedGet} from '../common/requests.js'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

class UserActions extends Component {
    render() {
        return (
            <div>
                <button className="btn btn-default btn-xs">Podgląd</button>
                &nbsp;
                <button className="btn btn-default btn-xs">Polowania</button>
            </div>
        )
    }
}

export default class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        let that = this;
        protectedGet('users')((err, res, body) => {
            that.setState({
                users: body
            })
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <BootstrapTable
                        data={this.state.users}
                        striped
                        pagination>
                        <TableHeaderColumn isKey
                                           dataField='login'
                                           filter={ {
                                               type: 'TextFilter',
                                               delay: 100,
                                               placeholder: 'szukaj...'
                                           } }
                                           dataSort={ true }>e-mail/login</TableHeaderColumn>
                        <TableHeaderColumn dataField='name'
                                           filter={ {
                                               type: 'TextFilter',
                                               delay: 100,
                                               placeholder: 'szukaj...'
                                           } }
                                           dataSort={ true }>Imię</TableHeaderColumn>
                        <TableHeaderColumn dataField='surname'
                                           filter={ {
                                               type: 'TextFilter',
                                               delay: 100,
                                               placeholder: 'szukaj...'
                                           } }
                                           dataSort={ true }>Nazwisko</TableHeaderColumn>
                        <TableHeaderColumn dataField='_id'
                                           dataFormat={(_id, user) => <UserActions _id={_id} user={user}/>}>
                            Akcje
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}