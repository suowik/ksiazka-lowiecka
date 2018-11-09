import React, {Component} from 'react'
import {protectedGet} from '../common/requests.js'

import {GoogleMap, withGoogleMap, Marker, Circle, InfoWindow} from "react-google-maps";
import {HuntingZone} from '../common/huntingZone.js';
import auth from '../auth/auth.js'
import FinishHunting from "./FinishHunting.js";
import AddHuntedAnimals from "./AddHuntedAnimals";


const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}>
        <HuntingZone/>
        {props.huntings.map(h => <Circle key={h.uniqueId} center={h.huntingSpot} radius={100}/>)}
        {props.huntings.map(h => {
            return <Marker key={h.uniqueId}
                           position={h.huntingSpot}
                           onClick={props.showInfo(h)}
                           zIndex={2}>
                {h.showInfo && <InfoWindow onCloseClick={props.closeInfo(h)}>
                    <div>
                        <strong>{h.user.name} {h.user.surname}</strong><br/>
                        Godzina zakończenia: {h.end}
                    </div>
                </InfoWindow>}
            </Marker>
        })}
    </GoogleMap>
));

export default class Huntings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            huntings: [],
            loggedUser: null
        }
    }

    componentDidMount() {
        let that = this;
        protectedGet("huntings?status=started")((err, res, body) => {
            that.setState({
                huntings: body.map(h => {
                    h.showInfo = false;
                    return h
                }),
                loggedUser: auth.loggedUser().userId
            })
        })
    }

    showInfo = (hunting) => {
        return () => {
            this.withHunting(hunting, (h) => h.showInfo = true)
        }
    };

    closeInfo = (hunting) => {
        return () => {
            this.withHunting(hunting, (h) => h.showInfo = false)
        }
    };

    withHunting = (area, cb) => {
        let huntings = this.state.huntings;
        let _hunting = huntings.find(a => a._id === area._id);
        if (_hunting) {
            cb(_hunting);
            this.setState({huntings: huntings})
        }
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <h3>Polowania</h3>
                    <Map
                        containerElement={
                            <div style={{height: `500px`}}/>
                        }
                        mapElement={
                            <div style={{height: `500px`}}/>
                        }
                        huntings={this.state.huntings}
                        showInfo={this.showInfo}
                        closeInfo={this.closeInfo}
                    />
                </div>
                <div className="row">
                    <ActiveHuntings
                        huntings={this.state.huntings}
                        showInfo={this.showInfo}
                        closeInfo={this.closeInfo}
                        postHook={() => protectedGet("huntings?status=started")((err, res, body) => {
                            this.setState({
                                huntings: body.map(h => {
                                    h.showInfo = false;
                                    return h
                                })
                            })
                        })}
                        userId={this.state.loggedUser}
                    />
                </div>
            </div>
        )
    }
}

class ActiveHuntings extends Component {
    render() {
        return (
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Myśliwy</th>
                    <th>Godzina rozpoczęcia</th>
                    <th>Godzina zakończenia</th>
                    <th>Akcje</th>
                </tr>
                </thead>
                <tbody>
                {this.props.huntings.map(hunting =>
                    <tr key={hunting._id}
                        onMouseOver={this.props.showInfo(hunting)}
                        onMouseOut={this.props.closeInfo(hunting)}
                    >
                        <td>{hunting.user.name} {hunting.user.surname}</td>
                        <td>{hunting.start}</td>
                        <td>{hunting.end}</td>
                        <td>
                            {hunting.status !== "finished" && hunting.user._id === this.props.userId
                            && <AddHuntedAnimals hunting={hunting}
                                                 postHook={this.props.postHook}/>}
                            {hunting.user._id === this.props.userId
                            && <FinishHunting hunting={hunting}
                                              postCreate={this.props.postHook}/>}
                        </td>
                    </tr>)}
                </tbody>
            </table>
        )
    }
}