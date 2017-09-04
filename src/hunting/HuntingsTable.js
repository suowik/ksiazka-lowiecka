import React, {Component} from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

import FinishHunting from "./FinishHunting.js";
import AddHuntedAnimals from "./AddHuntedAnimals.js";

export default class HuntingsTable extends Component {
    render() {
        return (<BootstrapTable
            data={this.props.huntings}
            striped
            options={
                {
                    defaultSortName: 'start',
                    defaultSortOrder: 'desc'
                }
            }
            pagination>
            <TableHeaderColumn isKey
                               dataField='_id'
                               hidden/>
            {this.props.showHunter && <TableHeaderColumn dataField='user'
                                                         dataSort={true}
                                                         sortFunc={(a, b, order) => {
                                                             if (order === 'desc') {
                                                                 return a.user.surname.localeCompare(b.user.surname);
                                                             } else {
                                                                 return b.user.surname.localeCompare(a.user.surname);
                                                             }
                                                         }}
                                                         dataFormat={(user, row) =>
                                                             <div>{user.name} {user.surname}</div>}>Myśliwy</TableHeaderColumn>}
            <TableHeaderColumn dataField='start' dataSort={true}>Rozpoczęte</TableHeaderColumn>
            <TableHeaderColumn dataField='end' dataSort={true}>Zakończone</TableHeaderColumn>
            <TableHeaderColumn dataField='huntedAnimals' width={'25%'} dataFormat={(animals, hunting) =>
                <table className="table table-condensed table-striped">
                    <thead>
                        <tr>
                            <td>Zwierzę</td>
                            <td>ilość</td>
                            <td>oddane strzały</td>
                        </tr>
                    </thead>
                    <tbody>
                    {animals.map(animal => (
                        <tr key={animal._id}>
                            <td>{animal.name}</td>
                            <td>{animal.hunted}</td>
                            <td>{animal.shots}</td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            }>Upolowane zwierzęta</TableHeaderColumn>
            {this.props.renderActions && <TableHeaderColumn dataField='hunting'
                                                            dataFormat={(hunting, row) =>
                                                                <div>
                                                                    {row.status !== "finished" && row.user._id === this.props.userId
                                                                    && <AddHuntedAnimals hunting={row}
                                                                                         postHook={this.props.postHook}/>}
                                                                    <br />
                                                                    {row.status === "started" && row.user._id === this.props.userId
                                                                    && <FinishHunting hunting={row}
                                                                                      postCreate={this.props.postHook}/>}
                                                                </div>}>Akcje</TableHeaderColumn>}
        </BootstrapTable>)
    }
}