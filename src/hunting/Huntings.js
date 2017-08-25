import React, {Component} from 'react'
import {protectedGet} from '../common/requests.js'

import {GoogleMap, withGoogleMap, Marker, Circle, InfoWindow} from "react-google-maps";


const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}>
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
            huntings: []
        }
    }

    componentDidMount() {
        let that = this;
        protectedGet("huntings?status=started")((err, res, body) => {
            that.setState({
                huntings: body.map(h => {
                    h.showInfo = false;
                    return h
                })
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
            </div>
        )
    }
}