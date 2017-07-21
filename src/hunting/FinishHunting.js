import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import request from 'request';
import moment from 'moment';

import auth from '../auth/auth.js'
import globals from '../common/globals.js'


let API_URL = globals['API_URL'];

export default class FinishHunting extends Component {
    constructor(props) {
        super(props);
        let now = moment();
        this.state = {
            showModal: false,
            endDate: now.format("YYYY-MM-DD"),
            endTime: now.format("HH:mm")
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.finishHunting = this.finishHunting.bind(this);
    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({showModal: true});
    }

    finishHunting(e) {
        e.preventDefault();
        let requestData = {
            end: this.state.endDate + ' ' + this.state.endTime,
            _id: this.props.hunting._id
        };
        let that = this;
        request({
            method: 'post',
            headers: {'x-access-token': auth.loggedUser().token},
            json: true,
            body: requestData,
            url: API_URL + '/huntings/finish'
        }, (err, res, body) => {
            that.close();
            that.props.postCreate();
        })

    }

    render() {
        return (<div>
            <Button onClick={this.open} bsSize="xsmall" bsStyle="danger">Zakończ polowanie</Button>
            <Modal show={this.state.showModal} onHide={this.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Zakończ polowanie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.finishHunting}>
                        <div className="form-group">
                            <label htmlFor="endHour">Godzina zakończenia</label>
                            <input type="time" readOnly="readOnly"
                                   defaultValue={this.state.endTime}
                                   className="form-control"
                                   id="endHour"
                                   placeholder="hh:mm"/>
                        </div>
                        <button type="submit" className="btn btn-default">Zakończ</button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>)
    }
}