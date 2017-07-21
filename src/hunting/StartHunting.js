import React, {Component} from "react";
import {Button, Modal} from "react-bootstrap";
import request from 'request';
import moment from 'moment'
import auth from '../auth/auth.js';
import globals from '../common/globals.js'
import utils from '../common/utils.js'


let API_URL = globals['API_URL'];
let hoursUntil9AM = utils['hoursUntil9AM'];


export default class StartHunting extends Component {

    componentDidMount() {
        let token = auth.loggedUser().token;
        let requestData = {
            method: 'get',
            headers: {'x-access-token': token},
            json: true,
            url: API_URL + '/huntingAreas'
        };
        let that = this;
        request(requestData, (err, res, body) => {
            let hunting = that.state.hunting;
            hunting.area = body[0]._id;
            that.setState({
                huntingAreas: body,
                hunting: hunting
            })
        });
    }

    constructor(props) {
        super(props);
        let now = moment();
        let hoursUntil = hoursUntil9AM(now);
        this.state = {
            showModal: false,
            huntingAreas: [],
            availableDurations: [...Array(hoursUntil).keys()],
            hunting: {
                startDate: now.format('YYYY-MM-DD'),
                startHour: now.format('HH:mm'),
                durationInHours: 1,
                area: "",
                userId: auth.loggedUser().userId
            }
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.startHunting = this.startHunting.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let hunting = this.state.hunting;
        hunting[name] = value;
        this.setState({
            hunting: hunting
        });
    }

    startHunting(e) {
        e.preventDefault();
        let form = this.state.hunting;
        let start = form.startDate + ' ' + form.startHour;
        let end = moment(start).add(form.durationInHours, 'hours').minutes(0).format('YYYY-MM-DD HH:mm');
        let hunting = {
            userId: form.userId,
            status: 'started',
            start: start,
            end: end,
            area: form.area,
            huntedAnimals: []
        };
        let postData = {
            method: 'post',
            url: API_URL + '/huntings',
            body: hunting,
            json: true
        };

        let that = this;
        request(postData, (err, res, body) => {
            if (res.statusCode === 409) {
                alert("Polowanie już zostało ropoczęte");
                that.close();
            } else {
                that.props.postCreate();
                that.close();
            }
        });
    }

    close() {
        this.setState({showModal: false});
    }

    open() {
        this.setState({
            showModal: true
        });
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
                        <form onSubmit={this.startHunting}>
                            <div className="form-group">
                                <label htmlFor="startDate">Data rozpoczęcia</label>
                                <input type="date"
                                       className="form-control"
                                       id="startDate"
                                       name="startDate"
                                       value={this.state.hunting.startDate}
                                       readOnly="readOnly"
                                       onChange={this.handleInputChange}
                                       placeholder="dd/mm/rrrr"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="startHour">Godzina rozpoczęcia</label>
                                <input type="time"
                                       className="form-control"
                                       id="startHour"
                                       name="startHour"
                                       readOnly="readOnly"
                                       value={this.state.hunting.startHour}
                                       onChange={this.handleInputChange}
                                       placeholder="dd/mm/rrrr"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="duration">Czas trwania (godziny)</label>
                                <select className="form-control"
                                        id="duration"
                                        name="durationInHours"
                                        value={this.state.hunting.durationInHours}
                                        onChange={this.handleInputChange}>
                                    {this.state.availableDurations.map(h => <option key={h + 1}
                                                                                    value={h + 1}>{h + 1}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="area">Rewir</label>
                                <select className="form-control"
                                        id="area"
                                        name="area"
                                        value={this.state.hunting.area}
                                        onChange={this.handleInputChange}>
                                    {this.state.huntingAreas.map(hA => <option key={hA._id}
                                                                               value={hA._id}>{hA.name}</option>)}
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