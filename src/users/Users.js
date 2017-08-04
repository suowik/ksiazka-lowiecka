import React, {Component} from 'react';
import {protectedGet, protectedPost} from '../common/requests.js'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import User from './User.js'
import UserHuntings from './UserHuntings.js'
import _ from 'lodash'

const defaultUser = {name: "", surname: "", address: {}};

export default class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user: defaultUser,
            editMode: false,
            showHuntings: false,
            huntings: []
        };
        this.loadHuntingsOfUser = this.loadHuntingsOfUser.bind(this);
        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
        let that = this;
        protectedGet('users')((err, res, body) => {
            that.setState({
                users: body
            })
        })
    }

    handleUserChange(field, value) {
        let user = this.state.user;
        _.set(user, field, value);
        this.setState({
            user: user
        });
    }

    handleUpdate(e) {
        e.preventDefault();
        let user = this.state.user;
        let that = this;
        protectedPost('users', user)(() => {
            that.setState({
                editMode: false,
                user: defaultUser
            })
        });
    }

    loadHuntingsOfUser(user) {
        let that = this;
        return (e) => {
            e.preventDefault();
            protectedGet('huntings?userId=' + user._id)((err, res, body) => {
                that.setState({
                    user: defaultUser,
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
                    <User visible={this.state.editMode}
                          data={this.state.user}
                          handleInputChange={this.handleUserChange}
                          handleUpdate={this.handleUpdate}
                          close={() => {
                              this.setState({
                                  editMode: false,
                                  user: defaultUser
                              })
                          }}/>
                    <UserHuntings user={this.state.user}
                                  huntings={this.state.huntings}
                                  close={() => {
                                      this.setState({
                                          showHuntings: false,
                                          user: defaultUser,
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