import React, {Component} from 'react'
import {protectedGet} from '../../common/requests.js'

import {GoogleMap, withGoogleMap, Marker, Circle} from "react-google-maps";


const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={15}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}
        onClick={props.selectHuntingPlace}>
        {props.huntings.map(h => <Circle key={h.uniqueId} center={h.huntingSpot} radius={100}/>)}
        <Circle center={props.hunting.huntingSpot} radius={100} />
    </GoogleMap>
));

export default class SelectHuntingArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            huntings: []
        }
    }

    componentDidMount() {
        let that = this;
        protectedGet("huntings?status=started")((err, res, body) => {
            that.setState({
                huntings: body
            })
        })
    }

    isHuntingSpotValid = (huntings, huntingSpot) => {
        let selectedHuntingSpot = this.props.data.hunting.huntingSpot;
        let collisionSpots = huntings
            .map(h => h.huntingSpot)
            .map(hs => {
                let latDiff = (hs.lat * 1000) - (selectedHuntingSpot.lat * 1000);
                let lngDiff = (hs.lng * 1000) - (selectedHuntingSpot.lng * 1000);
                let dx = latDiff * latDiff + lngDiff * lngDiff;
                return Math.sqrt(dx);
            })
            .filter(d => d < 2.7);
        return collisionSpots.length === 0 && huntingSpot.lat > 0 && huntingSpot.lng > 0;
    };

    selectHuntingPlace = (e) => {
        let position = e.latLng;
        this.props.data.handleSelectHuntingSpot(position);
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="pull-right">
                        <button className="btn btn-primary"
                                disabled={!this.isHuntingSpotValid(this.state.huntings, this.props.data.hunting.huntingSpot)}
                                onClick={(e) => this.props.transitionHandler("next")}>
                            Dalej
                        </button>
                    </div>
                </div>
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
                </div>
            </div>
        )
    }
}

