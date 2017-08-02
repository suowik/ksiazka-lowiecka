/* eslint-disable no-undef */
import React, {Component} from "react";
import shortid from 'shortid';
import {protectedGet, protectedPost} from '../common/requests.js'

export default class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: []
        };
        this.withAnimal = this.withAnimal.bind(this);
        this.saveAnimals = this.saveAnimals.bind(this);
        this.changeAnimalName = this.changeAnimalName.bind(this);
        this.activateAnimal = this.activateAnimal.bind(this);
        this.addAnimal = this.addAnimal.bind(this);
    }

    componentDidMount() {
        let that = this;
        protectedGet('/animals')((err, res, body) => {
            that.setState({
                animals: body
            });
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <h4>Zwierzęta</h4>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <td>
                                <button className="btn btn-default btn-block" onClick={this.saveAnimals}>Zapisz</button>
                            </td>
                            <td>
                                <button className="btn btn-default btn-block" onClick={this.addAnimal}>Dodaj zwierzę
                                </button>
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.animals.map(animal => <tr key={animal._id}>
                            <td><input type="text" value={animal.name} className="form-control"
                                       onChange={this.changeAnimalName(animal)}/></td>
                            <td>
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" checked={animal.active} value={animal.active}
                                               onChange={this.activateAnimal(animal)}/> Widoczny?
                                    </label>
                                </div>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    addAnimal() {
        let animals = this.state.animals;
        animals.push({_id: shortid.generate(), name: "", active: false});
        this.setState({
            animals: animals
        })
    }

    changeAnimalName(animal) {
        return (e) => {
            e.preventDefault();
            this.withAnimal(animal, (_animal) => _animal.name = e.target.value);
        }
    }

    activateAnimal(animal) {
        return (e) => {
            e.preventDefault();
            this.withAnimal(animal, (_animal) => _animal.active = e.target.checked);
        }
    }

    withAnimal(animal, cb) {
        let animals = this.state.animals;
        let _animal = animals.find(a => a._id === animal._id);
        if (_animal) {
            cb(_animal);
            this.setState({animals: animals})
        }
    }

    saveAnimals() {
        let animals = this.state.animals;
        animals.forEach(animal => {
            protectedPost('/animals', animal)(() => {
            });
        });
    }

}


