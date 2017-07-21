import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";

export default class FinishHunting extends Component {
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