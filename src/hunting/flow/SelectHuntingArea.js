import React, {Component} from 'react'
import {protectedGet} from '../../common/requests.js'
import auth from '../../auth/auth.js'

import {GoogleMap, withGoogleMap, Circle, Polygon} from "react-google-maps";


const huntingArea = [
    {
        "lat": 50.02340247574832,
        "lng": 20.718326568603516
    },
    {
        "lat": 50.01435800141573,
        "lng": 20.71695327758789
    },
    {
        "lat": 50.01016608230595,
        "lng": 20.714893341064453
    },
    {
        "lat": 50.00619445321425,
        "lng": 20.710773468017578
    },
    {
        "lat": 50.00398785079544,
        "lng": 20.70699691772461
    },
    {
        "lat": 50.000898437231115,
        "lng": 20.698070526123047
    },
    {
        "lat": 49.99405688634991,
        "lng": 20.679874420166016
    },
    {
        "lat": 49.98412387053013,
        "lng": 20.68777084350586
    },
    {
        "lat": 49.97926698282594,
        "lng": 20.688800811767578
    },
    {
        "lat": 49.9671226182598,
        "lng": 20.708026885986328
    },
    {
        "lat": 49.964030836098594,
        "lng": 20.75265884399414
    },
    {
        "lat": 49.959392790500694,
        "lng": 20.817203521728516
    },
    {
        "lat": 49.97175991915481,
        "lng": 20.792484283447266
    },
    {
        "lat": 49.98125395069867,
        "lng": 20.790081024169922
    },
    {
        "lat": 49.99030465481344,
        "lng": 20.78012466430664
    },
    {
        "lat": 49.99405688634991,
        "lng": 20.770511627197266
    },
    {
        "lat": 50.008180308784,
        "lng": 20.769824981689453
    },
    {
        "lat": 50.021637833966786,
        "lng": 20.760211944580078
    },
    {
        "lat": 50.0260493168799,
        "lng": 20.75094223022461
    }
];

const Map = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={13}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}
        onClick={props.selectHuntingPlace}>
        {props.huntings.map(h => <Circle key={h.uniqueId} center={h.huntingSpot} radius={100}/>)}
        <Polygon paths={huntingArea} options={{
            fillColor: `#80ff7f`,
            fillOpacity: 0.2,
            strokeWeight: 1,
            clickable: false,
            editable: false
        }}/>
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

