import React, {Component} from "react";
import shortid from "shortid";
import {protectedGet, protectedPost} from "../common/requests.js";
import _ from "lodash";
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';


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
            let animals = body.map((animal, index) => {
                if (animal.order === undefined) animal.order = index;
                return animal
            });
            animals.sort((a1, a2) => a1.order - a2.order);
            that.setState({
                animals: animals
            });
        })
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <h4>Zwierzęta</h4>
                    <SortableComponent animals={this.state.animals}
                                       handleChange={this.handleChange}
                                       addAnimal={this.addAnimal}
                                       saveAnimals={this.saveAnimals}
                                       handleSort={this.handleSort}/>
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

    handleSort = (oldIndex, newIndex) => {
        let animals = this.state.animals;
        animals = arrayMove(animals, oldIndex, newIndex);
        this.setState({animals: animals})
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
        animals.forEach((animal, index) => {
            animal.order = index;
            protectedPost('/animals', animal)(() => {
            });
        });
    }
}

const SortableItem = SortableElement(({data}) =>
    <tr>
        <td>
            <div><label htmlFor="name">Nazwa:</label>
                <input type="text"
                       value={data.animal.name}
                       name="name"
                       className="form-control"
                       onChange={data.handleChange(data.animal)}/>
            </div>
        </td>
        <td>
            <MonthSelect name="protection.from.month"
                         label="Okres ochronny od (miesiąc):"
                         animal={data.animal}
                         value={data.animal.protection.from.month}
                         handleChange={data.handleChange}/>
        </td>
        <td>
            <DaySelect name="protection.from.day"
                       label="Okres ochronny od (dzień):"
                       animal={data.animal}
                       value={data.animal.protection.from.day}
                       handleChange={data.handleChange}/>
        </td>
        <td>
            <MonthSelect name="protection.to.month"
                         label="Okres ochronny do (miesiąc):"
                         animal={data.animal}
                         value={data.animal.protection.to.month}
                         handleChange={data.handleChange}/>
        </td>
        <td>
            <DaySelect name="protection.to.day"
                       label="Okres ochronny do (dzień):"
                       animal={data.animal}
                       value={data.animal.protection.to.day}
                       handleChange={data.handleChange}/>
        </td>
    </tr>
);


const SortableList = SortableContainer(({data}) => {

    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <td>
                    <button className="btn btn-default btn-block" onClick={data.saveAnimals}>Zapisz</button>
                </td>
                <td>
                    <button className="btn btn-default btn-block" onClick={data.addAnimal}>Dodaj zwierzę
                    </button>
                </td>
            </tr>
            </thead>
            <tbody>
            {data.animals.map((animal, index) => <SortableItem key={animal._id} index={index}
                                                               data={{
                                                                   handleChange: data.handleChange,
                                                                   animal: animal
                                                               }}/>)}
            </tbody>
        </table>
    );
});

class SortableComponent extends Component {

    onSortEnd = ({oldIndex, newIndex}) => {
        this.props.handleSort(oldIndex, newIndex)
    };

    render() {
        return <SortableList data={{
            animals: this.props.animals,
            saveAnimals: this.props.saveAnimals,
            addAnimal: this.props.addAnimal,
            handleChange: this.props.handleChange
        }}
                             onSortEnd={this.onSortEnd}
        />;
    }
}