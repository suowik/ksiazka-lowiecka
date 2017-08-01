import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import request from 'request';

import auth from '../auth/auth.js'
import globals from '../common/globals.js'


let API_URL = globals['API_URL'];


export default class AddHuntedAnimals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            shots: 1,
            hunted: 1,
            animal: "",
            animals: []
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.addHuntedAnimals = this.addHuntedAnimals.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    componentDidMount() {
        let that = this;
        request({
            method: 'get',
            url: API_URL + '/animals?active=true',
            headers: {'x-access-token': auth.loggedUser().token},
            json: true
        }, (err, res, body) => {
            that.setState({
                animals: body,
                animal: body[0]._id
            })
        })
    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    addHuntedAnimals(e) {
        e.preventDefault();
        let that = this;
        let found = this.state.animals.filter(a => a._id.toString() === this.state.animal.toString());
        let requestData = {
            _id: this.props.hunting._id,
            animal: {
                _id: this.state.animal,
                name: found[0].name,
                shots: this.state.shots,
                hunted: this.state.hunted
            }
        };
        console.log(found)
        let options = {
            method: 'post',
            headers: {'x-access-token': auth.loggedUser().token},
            url: API_URL + '/huntings/animals',
            json: true,
            body: requestData
        };
        request(options, (err, res, body) => {
            that.props.postHook();
            that.close();
        })

    }

    render() {
        return (
            <div>
                <Button onClick={this.open} bsSize="xsmall" bsStyle="info">Dodaj upolowane zwierzęta</Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Dodaj upolowane zwierzęta</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this.addHuntedAnimals}>
                            <div className="form-group">
                                <label htmlFor="animal">Zwierzę</label>
                                <select className="form-control"
                                        id="animal"
                                        onChange={this.handleInputChange}
                                        value={this.state.animal}
                                        name="animal">
                                    {this.state.animals.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="shots">Oddane strzały</label>
                                <input type="number"
                                       min="1"
                                       className="form-control"
                                       name="shots"
                                       id="shots"
                                       value={this.state.shots}
                                       onChange={this.handleInputChange}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="hunted">Ilośc sztuk</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-control"
                                    name="hunted"
                                    id="hunted"
                                    value={this.state.hunted}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <Button bsSize="xsmall" type="submit">Zapisz</Button>
                        </form>
                    </Modal.Body>

                </Modal>
            </div>
        )
    }
}