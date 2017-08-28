import React, {Component} from "react";
import shortid from "shortid";
import {protectedGet, protectedPost} from "../common/requests.js";
import _ from "lodash";

class MonthSelect extends Component {
    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <select className="form-control"
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.props.handleChange(this.props.animal)}>
                    <option value={0}>styczeń</option>
                    <option value={1}>luty</option>
                    <option value={2}>marzec</option>
                    <option value={3}>kwiecień</option>
                    <option value={4}>maj</option>
                    <option value={5}>czerwiec</option>
                    <option value={6}>lipiec</option>
                    <option value={7}>sierpień</option>
                    <option value={8}>wrzesień</option>
                    <option value={9}>październik</option>
                    <option value={10}>listopad</option>
                    <option value={11}>grudzień</option>
                </select>
            </div>
        )
    }
}

class DaySelect extends Component {
    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <select className="form-control"
                        name={this.props.name}
                        value={this.props.value}
                        onChange={this.props.handleChange(this.props.animal)}>
                    {[...new Array(31).keys()].map(day => <option key={day} value={day}>{day}</option>)}
                </select>
            </div>
        )
    }
}

export default class Animals extends Component {

    constructor(props) {
        super(props);
        this.state = {
            animals: []
        };
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
                            <td>
                                <div><label htmlFor="name">Nazwa:</label>
                                    <input type="text"
                                           value={animal.name}
                                           name="name"
                                           className="form-control"
                                           onChange={this.handleChange(animal)}/>
                                </div>
                            </td>
                            <td>
                                <MonthSelect name="protection.from.month"
                                             label="Okres ochronny od (miesiąc):"
                                             animal={animal}
                                             value={animal.protection.from.month}
                                             handleChange={this.handleChange}/>
                            </td>
                            <td>
                                <DaySelect name="protection.from.day"
                                           label="Okres ochronny od (dzień):"
                                           animal={animal}
                                           value={animal.protection.from.day}
                                           handleChange={this.handleChange}/>
                            </td>
                            <td>
                                <MonthSelect name="protection.to.month"
                                             label="Okres ochronny do (miesiąc):"
                                             animal={animal}
                                             value={animal.protection.to.month}
                                             handleChange={this.handleChange}/>
                            </td>
                            <td>
                                <DaySelect name="protection.to.day"
                                           label="Okres ochronny do (dzień):"
                                           animal={animal}
                                           value={animal.protection.to.day}
                                           handleChange={this.handleChange}/>
                            </td>
                        </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    handleChange = (animal) => {
        return (e) => {
            e.preventDefault();
            const name = e.target.name;
            const value = e.target.value;
            this.withAnimal(animal, (_animal) => _.set(_animal, name, value))
        }
    };

    addAnimal = () => {
        let animals = this.state.animals;
        animals.push({
            _id: shortid.generate(),
            name: "",
            protection: {from: {day: 1, month: 1}, to: {day: 1, month: 1}}
        });
        this.setState({
            animals: animals
        })
    };

    withAnimal = (animal, cb) => {
        let animals = this.state.animals;
        let _animal = animals.find(a => a._id === animal._id);
        if (_animal) {
            cb(_animal);
            this.setState({animals: animals})
        }
    };

    saveAnimals = () => {
        let animals = this.state.animals;
        animals.forEach(animal => {
            protectedPost('/animals', animal)(() => {
            });
        });
    }

}


