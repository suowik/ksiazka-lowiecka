/* eslint-disable no-undef */
import React, {Component} from "react";

import {GoogleMap, withGoogleMap, Polygon, Marker, InfoWindow} from "react-google-maps";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";
import shortid from 'shortid';

import utils from '../common/utils.js'
import auth from '../auth/auth.js'
import globals from '../common/globals.js'
import request from 'request'

let API_URL = globals['API_URL'];

let centerOfGravity = utils['centerOfGravity'];

const MapOfAreas = withGoogleMap(props => (
    <GoogleMap
        defaultZoom={12}
        defaultCenter={new google.maps.LatLng(49.9965585, 20.7221137)}>
        <DrawingManager
            defaultDrawingMode={google.maps.drawing.OverlayType.POLYGON}
            onPolygonComplete={props.onAreaComplete}
            defaultOptions={{
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON
                    ],
                },
                polygonOptions: {
                    fillColor: `#80ff7f`,
                    fillOpacity: 0.6,
                    strokeWeight: 1,
                    clickable: false,
                    editable: false,
                    zIndex: 1,
                }
            }}
        />

        {props.areas.map((area) => {
            return <Marker key={'marker' + area._id}
                           position={area.marker.position}
                           onClick={props.showInfo(area)}
                           zIndex={2}>
                {area.marker.showInfo && (
                    <InfoWindow onCloseClick={props.closeInfo(area)}>
                        <div>
                            <strong>{area.name}</strong>
                        </div>
                    </InfoWindow>
                )}
            </Marker>
        })}

        {props.areas.map((area) => {
            return <Polygon key={area._id} paths={area.paths} zIndex={1}/>
        })}




    </GoogleMap>
));

class Areas extends Component {
    render() {
        return (<table className="table table-striped">
            {this.props.areas.map(area =>
                <tr key={area._id}>
                    <td onMouseOver={this.props.showInfo(area)}
                        onMouseLeave={this.props.closeInfo(area)}>
                        <input className="form-control"
                               type="text" value={area.name}
                               onChange={this.props.updateAreaName(area)}/>
                    </td>
                </tr>
            )}
        </table>);
    }
}

export default class HuntingAreas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            areas: []
        };
        this.areaCreated = this.areaCreated.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.closeInfo = this.closeInfo.bind(this);
        this.withArea = this.withArea.bind(this);
        this.saveAreas = this.saveAreas.bind(this);
    }

    areaCreated(evt) {
        let paths = [];
        evt.getPath().forEach(coords => paths.push({lat: coords.lat(), lng: coords.lng()}));
        let areas = this.state.areas;
        areas.push({
            paths: paths,
            marker: {position: centerOfGravity(paths), showInfo: false},
            name: "Nowy obszar",
            _id: shortid.generate()
        });
        this.setState({
            areas: areas
        })
    }

    showInfo(area) {
        return (e) => {
            e.preventDefault();
            this.withArea(area, (_area) => _area.marker.showInfo = true);
        }
    }

    closeInfo(area) {
        return (e) => {
            e.preventDefault();
            this.withArea(area, (_area) => _area.marker.showInfo = false);
        }
    }

    withArea(area, cb) {
        let areas = this.state.areas;
        let _area = areas.find(a => a._id === area._id);
        if (_area) {
            cb(_area);
            this.setState({areas: areas})
        }
    }

    saveAreas() {
        let areas = this.state.areas;
        let loggedUser = auth.loggedUser();
        let token = loggedUser.token;
        areas.forEach(area => {
            let requestData = {
                method: 'post',
                headers: {'x-access-token': token},
                json: true,
                body: area,
                url: API_URL + '/huntingAreas'
            };
            request(requestData, (err, res, body) => {
            });
        });
    }

    componentDidMount() {
        let loggedUser = auth.loggedUser();
        let token = loggedUser.token;
        let that = this;
        let requestData = {
            method: 'get',
            headers: {'x-access-token': token},
            json: true,
            url: API_URL + '/huntingAreas'
        };
        request(requestData, (err, res, body) => {
            that.setState({
                areas: body
            });
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-lg-2">
                    <h4>Obszary</h4>
                    <Areas areas={this.state.areas}
                           updateAreaName={(area) => {
                               return (e) => {
                                   this.withArea(area, (_a) => _a.name = e.target.value)
                               }
                           }}
                           showInfo={this.showInfo}
                           closeInfo={this.closeInfo}/>
                    <button className="btn btn-block btn-xs btn-primary"
                            onClick={this.saveAreas}>Zapisz obszary
                    </button>
                </div>
                <div className="col-lg-10">
                    <MapOfAreas
                        containerElement={
                            <div style={{height: `500px`}}/>
                        }
                        mapElement={
                            <div style={{height: `500px`}}/>
                        }
                        areas={this.state.areas}
                        showInfo={this.showInfo}
                        closeInfo={this.closeInfo}
                        onAreaComplete={this.areaCreated}
                    />
                </div>
            </div>
        );
    }
}


