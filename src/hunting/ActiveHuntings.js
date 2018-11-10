import React, {Component} from "react";
import AddHuntedAnimals from "./AddHuntedAnimals";
import FinishHunting from "./FinishHunting";

export default class ActiveHuntings extends Component {
    render() {
        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Myśliwy</th>
                    <th>Rozpoczęte</th>
                    <th>Zakończone</th>
                    <th>Upolowane zwierzęta</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {this.props.huntings.map(hunting =>
                    <tr key={hunting._id}
                        onMouseOver={this.props.showInfo(hunting)}
                        onMouseOut={this.props.closeInfo(hunting)}>
                        <td>{hunting.user.name} {hunting.user.surname}</td>
                        <td>{hunting.start}</td>
                        <td>{hunting.end}</td>
                        <td>
                            {hunting.huntedAnimals.length > 0 && <table className="table table-condensed table-striped">
                                <thead>
                                <tr>
                                    <td>Zwierzę</td>
                                    <td>ilość</td>
                                    <td>oddane strzały</td>
                                </tr>
                                </thead>
                                <tbody>
                                {hunting.huntedAnimals.map(animal => (
                                    <tr key={animal._id+''+hunting._id}>
                                        <td>{animal.name}</td>
                                        <td>{animal.hunted}</td>
                                        <td>{animal.shots}</td>

                                    </tr>
                                ))}
                                </tbody>
                            </table>}
                        </td>
                        <td>
                            {hunting.status !== "finished" && hunting.user._id === this.props.userId
                            && <AddHuntedAnimals hunting={hunting}
                                                 postHook={this.props.postHook}/>}
                            {hunting.status !== "finished" && hunting.user._id === this.props.userId
                            && <FinishHunting hunting={hunting}
                                              postCreate={this.props.postHook}/>}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        )
    }
}