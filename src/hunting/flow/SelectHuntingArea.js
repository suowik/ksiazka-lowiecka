import React, {Component} from 'react'
import {protectedGet} from '../../common/requests.js'
import auth from '../../auth/auth.js'

import {GoogleMap, withGoogleMap, Circle} from "react-google-maps";
import {HuntingZone} from '../../common/huntingZone.js';

const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}
        onClick={props.selectHuntingPlace}>
        {props.huntings.map(h => <Circle key={h.uniqueId} center={h.huntingSpot} radius={100}/>)}
        <HuntingZone/>
        <Circle center={props.hunting.huntingSpot} radius={100}/>
    </GoogleMap>
));

export default class SelectHuntingArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            huntings: [],
            loading: true,
            canStartTheHunting: true
        }
    }

    componentDidMount() {
        let that = this;
        protectedGet("huntings?status=started")((err, res, body) => {
            let loggedUserIsOnHunting = body.some(h => h.user._id === auth.loggedUser().userId);
            that.setState({
                huntings: body,
                loading: false,
                canStartTheHunting: !loggedUserIsOnHunting
            })
        })
    }

    isHuntingSpotValid = (huntings, huntingSpot) => {
        let selectedHuntingSpot = this.props.data.hunting.huntingSpot;
        let isInCollision = huntings
            .map(h => h.huntingSpot)
            .map(hs => {
                let latDiff = (hs.lat * 1000) - (selectedHuntingSpot.lat * 1000);
                let lngDiff = (hs.lng * 1000) - (selectedHuntingSpot.lng * 1000);
                let dx = latDiff * latDiff + lngDiff * lngDiff;
                return Math.sqrt(dx);
            })
            .some(d => d < 2.7);
        return !isInCollision && huntingSpot.lat > 0 && huntingSpot.lng > 0;
    };

    selectHuntingPlace = (e) => {
        let position = e.latLng;
        this.props.data.handleSelectHuntingSpot(position);
    };

    render() {
        return (
            <div className="container">
                {this.state.loading && <h4>Wczytywanie</h4>}
                {!this.state.loading && !this.state.canStartTheHunting && <h4>Jesteś już na polowaniu</h4>}

                {!this.state.loading && this.state.canStartTheHunting &&
                <div className="row">

                    <div className="pull-right">
                        <button className="btn btn-primary"
                                disabled={!this.isHuntingSpotValid(this.state.huntings, this.props.data.hunting.huntingSpot)}
                                onClick={(e) => this.props.transitionHandler("next")}>
                            Dalej
                        </button>
                    </div>
                </div>}
                {!this.state.loading && this.state.canStartTheHunting &&
                <div className="row">
                    <Map
                        containerElement={
                            <div style={{height: `500px`}}/>
                        }
                        mapElement={
                            <div style={{height: `500px`}}/>
                        }
                        hunting={this.props.data.hunting}
                        selectHuntingPlace={this.selectHuntingPlace}
                        huntings={this.state.huntings}
                    />
                </div>}
            </div>
        )
    }
}

