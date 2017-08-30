import React, {Component} from 'react'
import {hoursUntil9AM} from '../../common/utils.js'
import moment from 'moment'

export default class FillHuntingDetails extends Component {

    constructor(props) {
        super(props);
        let hoursUntil = hoursUntil9AM(moment());
        this.state = {
            availableDurations: [...new Array(hoursUntil).keys()],
        }
    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.props.data.handleInputChange(name, value)
    };

    startHunting = (e) => {
        e.preventDefault();
        let that = this;
        this.props.data.startHunting(() => {
            that.props.transitionHandler("next")
        })
    };

    render() {
        return (
            <div className="container">
                <div className="row">

                </div>
                <div className="row">
                    <form onSubmit={this.startHunting}>
                        <div className="form-group">
                            <label htmlFor="startDate">Data rozpoczęcia</label>
                            <input type="date"
                                   className="form-control"
                                   id="startDate"
                                   name="startDate"
                                   value={this.props.data.hunting.startDate}
                                   onChange={this.handleInputChange}
                                   placeholder="dd/mm/rrrr"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="startHour">Godzina rozpoczęcia</label>
                            <input type="time"
                                   className="form-control"
                                   id="startHour"
                                   name="startHour"
                                   value={this.props.data.hunting.startHour}
                                   onChange={this.handleInputChange}
                                   placeholder="dd/mm/rrrr"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="duration">Czas trwania (godziny)</label>
                            <select className="form-control"
                                    id="duration"
                                    name="durationInHours"
                                    value={this.props.data.hunting.durationInHours}
                                    onChange={this.handleInputChange}>
                                {this.state.availableDurations.map(h => <option key={h + 1}
                                                                                value={h + 1}>{h + 1}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-primary pull-left"
                                onClick={(e) => this.props.transitionHandler("prev")}>
                            Wstecz
                        </button>
                        <button type="submit" className="btn btn-primary pull-right">Rozpocznij</button>
                    </form>
                </div>
            </div>
        )
    }
}
