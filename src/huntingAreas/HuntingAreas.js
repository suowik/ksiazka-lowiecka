/* eslint-disable no-undef */
import React, {Component} from "react";

import {GoogleMap, withGoogleMap, Polygon, Marker} from "react-google-maps";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";

const DrawingExampleGoogleMap = withGoogleMap(props => (
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
        {props.areas.map((path) => {
            return <Polygon key={centerOfGravity(path).lat} paths={path}/>
        })}


        {props.areas.map((path) => {
            return <Marker key={centerOfGravity(path).lat} position={centerOfGravity(path)}/>
        })}

    </GoogleMap>
));

export default class HuntingAreas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            areas: []
        }
    }

    render() {
        return (
            <DrawingExampleGoogleMap
                containerElement={
                    <div style={{height: `500px`}}/>
                }
                mapElement={
                    <div style={{height: `500px`}}/>
                }
                areas={this.state.areas}
                onAreaComplete={(evt) => {
                    let newArea = [];
                    evt.getPath().forEach(coords=>newArea.push({lat: coords.lat(), lng: coords.lng()}))
                    let areas = this.state.areas;
                    areas.push(newArea);
                    this.setState({
                        areas: areas
                    })
                }}
            />
        );
    }
}

function centerOfGravity(path) {
    let N = path.length;
    return {
        lat: (path.map(p => p.lat).reduce((a, b) => a + b)) / N,
        lng: (path.map(p => p.lng).reduce((a, b) => a + b)) / N,
    }
}


