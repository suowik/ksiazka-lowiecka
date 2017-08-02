import React, {Component} from 'react';
import {protectedGet} from '../common/requests.js'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import User from './User.js'
import UserHuntings from './UserHuntings.js'

export default class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user: {name: "", surname: ""},
            editMode: false,
            showHuntings: false,
            huntings: []
        };
        this.loadHuntingsOfUser = this.loadHuntingsOfUser.bind(this);
    }

    componentDidMount() {
        let that = this;
        protectedGet('users')((err, res, body) => {
            that.setState({
                users: body
            })
        })
    }

    loadHuntingsOfUser(user) {
        let that = this;
        return (e) => {
            e.preventDefault();
            protectedGet('huntings?userId=' + user._id)((err, res, body) => {
                that.setState({
                    user: user,
                    huntings: body,
                    showHuntings: true
                })
            })
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <User visible={this.state.editMode} data={this.state.user} close={() => {
                        this.setState({
                            editMode: false,
                            user: {name: "", surname: ""}
                        })
                    }}/>
                    <UserHuntings user={this.state.user}
                                  huntings={this.state.huntings}
                                  close={() => {
                                      this.setState({
                                          showHuntings: false,
                                          user: {name: "", surname: ""},
                                          huntings: []
                                      })
                                  }}
                                  visible={this.state.showHuntings}/>
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
                                           dataFormat={(_id, user) =>
                                               <div>
                                                   <button className="btn btn-default btn-xs" onClick={() => {
                                                       this.setState({
                                                           user: user,
                                                           editMode: true
                                                       })
                                                   }}>Podgląd
                                                   </button>
                                                   &nbsp;
                                                   <button className="btn btn-default btn-xs"
                                                           onClick={this.loadHuntingsOfUser(user)}>Polowania
                                                   </button>
                                               </div>
                                           }>
                            Akcje
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}