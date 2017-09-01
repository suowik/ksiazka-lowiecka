import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import {protectedGet, protectedPost} from '../common/requests.js';
import moment from 'moment'
import _ from 'lodash'

class HuntedAnimal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animal: props.animal
        }
    }

    handleInputChange = (animalId, index) => {
        return (event) => {
            const target = event.target;
            const value = target.value;
            const name = target.name;
            this.props.handleAnimalSelect(animalId, index, name, value)
        }
    };

    render() {
        return (
            <tr>
                <td>
                    <select className="form-control"
                            id="_id"
                            onChange={this.handleInputChange(this.state.animal._id, this.props.index)}
                            value={this.state.animal._id}
                            name="_id">
                        <option value={-1}>---</option>
                        {this.props.animals.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                </td>
                <td>
                    <input type="number"
                           min="0"
                           className="form-control"
                           name="shots"
                           id="shots"
                           value={this.state.animal.shots}
                           onChange={this.handleInputChange(this.state.animal._id, this.props.index)}/>
                </td>
                <td>
                    <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="hunted"
                        id="hunted"
                        value={this.state.animal.hunted}
                        onChange={this.handleInputChange(this.state.animal._id, this.props.index)}
                    />
                </td>
            </tr>
        )
    }
}


export default class AddHuntedAnimals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            animals: [],
            huntedAnimals: props.hunting.huntedAnimals
        };
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    };

    close = () => {
        this.setState({showModal: false});
    };

    open = () => {
        this.setState({showModal: true});
    };

    addHuntedAnimals = (e) => {
        e.preventDefault();
        let that = this;
        let hunting = this.props.hunting;
        let requestData = {
            animals: this.state.huntedAnimals,
            _id: hunting._id
        };
        protectedPost('/huntings/animals', requestData)(() => {
            that.props.postHook();
            that.close();
        });

    };

    componentDidMount() {
        let that = this;
        protectedGet('/animals')((err, res, body) => {
            /*
             let now = moment();
             let animals = body.filter(animal => {
             let from = moment([now.year(), animal.protection.from.month, animal.protection.from.day]);
             let to = moment([now.year(), animal.protection.to.month, animal.protection.to.day]);
             return now.isBetween(from, to)
             });
             */
            that.setState({
                animals: body,
            })
        });
    }

    addAnimal = (e) => {
        e.preventDefault();
        let huntedAnimals = this.state.huntedAnimals;
        huntedAnimals.push({_id: this.state.animals[0]._id, name: "", shots: 0, hunted: 0});
        this.setState({
            huntedAnimals: huntedAnimals
        });
    };

    handleAnimalSelect = (animalId, index, name, value) => {
        let huntedAnimals = this.state.huntedAnimals;
        let animal = huntedAnimals[index];
        _.set(animal, name, value);
        if (name === "_id") {
            let found = this.state.animals.filter(a => a._id === value);
            _.set(animal, "name", found[0].name);
        }
        this.setState({
            huntedAnimals: huntedAnimals
        });
    };

    render() {
        return (
            <div>
                <Button onClick={this.open} bsSize="xsmall" bsStyle="info">Strzały i zwierzęta</Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Oddane strzały i zwierzęta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.addHuntedAnimals}>
                            <table className="table table-striped table-condensed">
                                <thead>
                                <tr>
                                    <th>Zwierzę</th>
                                    <th>Oddane strzały</th>
                                    <th>Ilość</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.huntedAnimals.map((animal, i) => {
                                    return <HuntedAnimal key={i}
                                                         index={i}
                                                         animal={animal}
                                                         animals={this.state.animals}
                                                         handleAnimalSelect={this.handleAnimalSelect}
                                    />
                                })}
                                </tbody>
                            </table>
                            <div className="btn-group" role="group">
                                <button type="submit"
                                        className="btn btn-primary pull-left">Zapisz
                                </button>
                                <button className="btn btn-default pull-right"
                                        onClick={this.addAnimal}>Dodaj zwierzę
                                </button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}