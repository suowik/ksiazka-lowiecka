/* eslint-disable no-undef */
import React, {Component} from "react";


import shortid from 'shortid';

import utils from '../common/utils.js'
import auth from '../auth/auth.js'
import globals from '../common/globals.js'
import request from 'request'

import MapOfAreas from './MapOfAreas.js';
import Areas from './Areas.js';

let API_URL = globals['API_URL'];

let centerOfGravity = utils['centerOfGravity'];


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
        this.activateArea = this.activateArea.bind(this);
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
                <div className="col-lg-4">
                    <h4>Obszary</h4>
                    <Areas areas={this.state.areas}
                           updateAreaName={(area) => {
                               return (e) => {
                                   this.withArea(area, (_a) => _a.name = e.target.value)
                               }
                           }}
                           showInfo={this.showInfo}
                           closeInfo={this.closeInfo}
                           activateArea={this.activateArea}/>
                    <button className="btn btn-block btn-xs btn-primary"
                            onClick={this.saveAreas}>Zapisz obszary
                    </button>
                </div>
                <div className="col-lg-8">
                    <MapOfAreas
                        containerElement={
                            <div style={{height: `500px`}}/>
                        }
                        mapElement={
                            <div style={{height: `500px`}}/>
                        }
                        areas={this.state.areas.filter(a => a.active)}
                        showInfo={this.showInfo}
                        closeInfo={this.closeInfo}
                        onAreaComplete={this.areaCreated}
                    />
                </div>
            </div>
        );
    }

    areaCreated(evt) {
        let paths = [];
        evt.getPath().forEach(coords => paths.push({lat: coords.lat(), lng: coords.lng()}));
        let areas = this.state.areas;
        areas.push({
            paths: paths,
            marker: {position: centerOfGravity(paths), showInfo: false},
            name: "Nowy obszar",
            _id: shortid.generate(),
            active: true
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

    activateArea(area) {
        return (e) => {
            e.preventDefault();
            console.log(e.target.checked)
            this.withArea(area, (_area) => _area.active = e.target.checked);
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

}


