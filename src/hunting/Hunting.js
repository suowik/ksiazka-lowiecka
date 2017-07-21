import React, {Component} from "react";
import FinishHunting from "./FinishHunting.js";
import AddHuntedAnimals from "./AddHuntedAnimals.js";

export default class Hunting extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.hunting.user.name} {this.props.hunting.user.surname}</td>
                <td>{this.props.hunting.start}</td>
                <td>{this.props.hunting.end}</td>
                <td>
                    {this.props.hunting.huntedAnimals.length > 0 &&
                    <ul>
                        {this.props.hunting.huntedAnimals.map(animal => (
                            <li key={animal.name}><strong>{animal.name}</strong> oddane strzały: {animal.shots} sztuk: {animal.hunted}</li>
                        ))}
                    </ul>
                    }
                </td>
                <td>{this.props.hunting.area.name}</td>
                <td>
                    {this.props.hunting.status !== "finished" &&
                    <AddHuntedAnimals hunting={this.props.hunting}/>}
                    <br />
                    {this.props.hunting.status === "started" &&
                    <FinishHunting hunting={this.props.hunting}/>}
                </td>
            </tr>
        )
    }
}
