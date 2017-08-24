import React, {Component} from 'react'

import {GoogleMap, withGoogleMap, Marker, Circle} from "react-google-maps";


const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={15}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}
        onClick={props.selectHuntingPlace}>
        <Circle center={props.hunting.huntingSpot} radius={100}/>
    </GoogleMap>
));

export default class SelectHuntingArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complete: this.isHuntingSpotValid(props.data.hunting.huntingSpot)
        }
    }

    isHuntingSpotValid = (huntingSpot) => {
        return huntingSpot.lat > 0 && huntingSpot.lng > 0;
    };

    selectHuntingPlace = (e) => {
        let position = e.latLng;
        this.props.data.handleSelectHuntingSpot(position);
        this.setState({
            complete: true
        })
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="pull-right">
                        <button className="btn btn-primary"
                                disabled={!this.state.complete}
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
                    />
                </div>
            </div>
        )
    }
}

