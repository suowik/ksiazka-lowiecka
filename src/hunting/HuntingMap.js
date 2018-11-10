import {Circle, GoogleMap, InfoWindow, Marker, withGoogleMap} from "react-google-maps";
import {HuntingZone} from "../common/huntingZone";
import React from "react";

export const Map = withGoogleMap(props => (
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