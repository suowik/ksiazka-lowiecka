import {GoogleMap, withGoogleMap, Polygon, Marker, InfoWindow} from "react-google-maps";
import DrawingManager from "react-google-maps/lib/drawing/DrawingManager";

export default MapOfAreas = withGoogleMap(props => (
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