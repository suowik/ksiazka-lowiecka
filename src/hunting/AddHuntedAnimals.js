import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";

export default class AddHuntedAnimals extends Component {
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