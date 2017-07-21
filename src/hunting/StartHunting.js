import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";

export default class StartHunting extends Component {

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