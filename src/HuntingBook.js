import React, {Component} from 'react';
import {Button, ButtonToolbar, OverlayTrigger, Popover, Modal} from 'react-bootstrap';


function popover(animals) {
    return <Popover id="hunted-animals" title="Upolowane zwierzęta">
        <ul>
            {animals.map(animal => (
                <li key={animal.name}>{animal.name} ({animal.shots})</li>
            ))}
        </ul>
    </Popover>
}

const huntings = [
    {
        id: 3,
        state: "FINISHED",
        huntedBy: {id: 1, name: "Jan", surname: "Kowalski"},
        startDate: new Date().toDateString(),
        startHour: "15:30",
        endHour: "17:45",
        animals: [{id: 90, name: "kaczka", shots: 3}, {name: "dzik", shots: 5}],
        area: {id: 3, name: "Tarnów"}
    },
    {
        id: 4,
        state: "STARTED",
        huntedBy: {id: 1, name: "Jan", surname: "Kowalski"},
        startDate: new Date().toDateString(),
        startHour: "18:00",
        animals: [],
        area: {id: 3, name: "Tarnów"}
    },
    {
        id: 5,
        state: "STARTED",
        huntedBy: {id: 1, name: "Jan", surname: "Kowalski"},
        startDate: new Date().toDateString(),
        startHour: "19:30",
        animals: [{id: 90, name: "kaczka", shots: 3}, {name: "dzik", shots: 5}],
        area: {id: 3, name: "Tarnów"}
    }
];

class FinishHunting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    render() {
        return (<div>
            <Button onClick={this.open} bsSize="xsmall" bsStyle="danger">Zakończ polowanie</Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Zakończ polowanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="endHour">Godzina zakończenia</label>
                            <input type="time" className="form-control" id="endHour"
                                   placeholder="hh:mm"/>
                        </div>
                        <button type="submit" className="btn btn-default">Zakończ</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>)
    }

}

class AddHuntedAnimals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    render() {
        return (<div>
            <Button onClick={this.open} bsSize="xsmall" bsStyle="info">Dodaj upolowane zwierzęta</Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj upolowane zwierzęta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="animal">Zwierzę</label>
                            <select className="form-control" id="animal">
                                <option value="dzik">Dzik</option>
                                <option value="kaczka">Kaczka</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="shots">Oddane strzały</label>
                            <input type="number" min="1" defaultValue="1" className="form-control" id="shots"/>
                        </div>
                        <Button bsSize="xsmall" type="submit">Zapisz</Button>
                    </form>
                </Modal.Body>

            </Modal>
        </div>)
    }
}

class Hunting extends Component {
    render() {
        return (
            <tr>
                <td>{this.props.hunting.huntedBy.name} {this.props.hunting.huntedBy.surname}</td>
                <td>{this.props.hunting.startDate}</td>
                <td>{this.props.hunting.startHour}</td>
                <td>{this.props.hunting.endHour}</td>
                <td>
                    {this.props.hunting.animals.length > 0 &&
                    <OverlayTrigger trigger="click" placement="left"
                                    overlay={popover(this.props.hunting.animals)}>
                        <Button bsSize="xsmall">Podgląd</Button>
                    </OverlayTrigger>
                    }
                </td>
                <td>{this.props.hunting.area.name}</td>
                <td>
                    {this.props.hunting.state !== "FINISHED" &&
                    <AddHuntedAnimals hunting={this.props.hunting}/>}
                    <br />
                    {this.props.hunting.state === "STARTED" &&
                    <FinishHunting hunting={this.props.hunting}/>}
                </td>
            </tr>
        )
    }
}


class HuntingBook extends Component {

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-bordered table-condensed table-striped">
                    <thead>
                    <tr>
                        <th colSpan={7}>
                            <AddNewRecordModal />
                        </th>
                    </tr>
                    <tr>
                        <th>Myśliwy</th>
                        <th>Data</th>
                        <th>Godzina rozpoczęcia</th>
                        <th>Godzina zakończenia</th>
                        <th>Upolowane zwierzęta</th>
                        <th>Rewir</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {huntings.map(hunting => <Hunting key={hunting.id} hunting={hunting}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}

class AddNewRecordModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    render() {
        return (
            <div>
                <Button onClick={this.open}>Rozpocznij polowanie</Button>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Rozpocznij polowanie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <div className="form-group">
                                <label htmlFor="startDate">Data rozpoczęcia</label>
                                <input type="date" className="form-control" id="startDate"
                                       placeholder="dd/mm/rrrr"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="startHour">Godzina rozpoczęcia</label>
                                <input type="time" className="form-control" id="startHour"
                                       placeholder="hh:mm"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="area">Rewir</label>
                                <select className="form-control" id="area">
                                    <option value="tarnow">Tarnów</option>
                                    <option value="test">test</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-default">Rozpocznij</button>
                        </form>
                    </Modal.Body>

                </Modal>
            </div>
        )
    }
}


export default HuntingBook