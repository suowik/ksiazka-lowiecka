import React, {Component} from 'react'
import {protectedGet} from '../common/requests.js'
import auth from '../auth/auth.js'
import HuntingsWithMap from "./HuntingsWithMap.js";
import moment from "moment"
import _ from "lodash"

export default class HuntingsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            huntings: [],
            filteredHuntings: [],
            loggedUser: auth.loggedUser().userId,
            filterCriteria: {
                status: "started",
                start: moment().subtract(1, 'd').format("YYYY-MM-DD"),
                end: moment().add(2, 'd').format("YYYY-MM-DD"),
                hunter: ""
            },
            filters: [
                (hunting) => {
                    if (this.state.filterCriteria.hunter !== "") {
                        return hunting.user._id === this.state.filterCriteria.hunter
                    } else {
                        return true
                    }
                },
                (hunting) => {
                    if (this.state.filterCriteria.status !== "") {
                        return hunting.status === this.state.filterCriteria.status
                    }
                    return true
                },
                (hunting) => moment(hunting.start, 'YYYY-MM-DD').isAfter(this.state.filterCriteria.start),
                (hunting) => moment(hunting.end, 'YYYY-MM-DD').isBefore(this.state.filterCriteria.end)
            ]
        }
    }

    componentDidMount() {
        this.refresh()
    }

    refresh = () => {
        protectedGet("huntings")((err, res, body) => {
            let huntings = body.map(h => {
                console.log(h)
                h.showInfo = false;
                return h
            }).sort((a, b) => {
                if (moment(a, 'YYYY-MM-DD').isAfter(moment(b, 'YYYY-MM-DD'))) {
                    return 1
                }
                return -1
            });
            this.setState({
                huntings: huntings,
            })
        })
    };

    filter = () => {
        return this.state.huntings.filter(hunting => this.state.filters.every(filter => filter(hunting)));
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h3>Wyszukaj polowania:</h3>
                    <HuntingsFilter huntings={this.state.huntings}
                                    postFilter={(criteria) => {
                                        this.setState({
                                            filterCriteria: criteria
                                        })
                                    }}
                    />
                    <HuntingsWithMap huntings={this.filter()}
                                     loggedUser={this.state.loggedUser}
                                     showInfo={this.showInfo}
                                     closeInfo={this.closeInfo}
                                     updateHuntings={(huntings) => {
                                         this.setState({
                                             filteredHuntings: huntings
                                         })
                                     }}
                                     refresh={this.refresh}
                    />
                </div>
            </div>
        );
    }
}

class HuntingsFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "started",
            start: moment().subtract(1, 'd').format("YYYY-MM-DD"),
            end: moment().add(1, 'd').format("YYYY-MM-DD"),
            hunter: "",

        }
    }

    onChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let formData = this.state;
        formData[name] = value;
        this.setState({
            formData: formData
        });
        this.props.postFilter({
            status: this.state.status,
            start: this.state.start,
            end: this.state.end,
            hunter: this.state.hunter,
        })
    };


    render() {
        const hunters = _.groupBy(this.props.huntings.map(hunting => hunting.user), "_id");
        return (
            <div className={"row"}>
                <form className="form-inline">
                    <div className="form-group">
                        <label htmlFor={"status"}>Status: </label>
                        <select className="form-control"
                                name={"status"}
                                onChange={this.onChange}
                                value={this.state.status}>
                            <option value={""}>Wszystkie</option>
                            <option value={"started"}>Aktywne</option>
                            <option value={"finished"}>Zakończone</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor={"status"}>Data rozpoczęcia: </label>
                        <input className="form-control" type="date" name="start" value={this.state.start}
                               onChange={this.onChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor={"status"}>Data zakończenia: </label>
                        <input className="form-control" type="date" name="end" value={this.state.end}
                               onChange={this.onChange}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor={"status"}>Myśliwy: </label>
                        <select className="form-control"
                                name={"hunter"}
                                onChange={this.onChange}
                                value={this.state.hunter}>
                            <option value="">Wszyscy</option>
                            {Object.keys(hunters).map(k => {
                                const mappedHunter = hunters[k][0];
                                return <option key={k} value={k}>{mappedHunter.name} {mappedHunter.surname}</option>
                            })}
                        </select>
                    </div>
                </form>
            </div>
        );
    }
}
