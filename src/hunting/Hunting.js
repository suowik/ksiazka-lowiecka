import React, {Component} from "react";
import FinishHunting from "./FinishHunting.js";
import AddHuntedAnimals from "./AddHuntedAnimals.js";
import auth from '../auth/auth.js'

export default class Hunting extends Component {
    constructor(props) {
        super(props);
        console.log(props.hunting)
        this.state = {
            userId: auth.loggedUser().userId
        }
    }

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
                            <li key={animal.name}><strong>{animal.name}</strong> oddane strzały: {animal.shots}
                                sztuk: {animal.hunted}</li>
                        ))}
                    </ul>
                    }
                </td>
                <td>{this.props.hunting.area.name}</td>
                <td>
                    {this.props.hunting.status !== "finished"
                    && this.props.hunting.user._id === this.state.userId
                    && <AddHuntedAnimals hunting={this.props.hunting}/>}
                    <br />
                    {this.props.hunting.status === "started"
                    && this.props.hunting.user._id === this.state.userId
                    && <FinishHunting hunting={this.props.hunting} postCreate={this.props.postCreate}/>}
                </td>
            </tr>
        )
    }
}
