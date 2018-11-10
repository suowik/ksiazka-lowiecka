import {Component} from "react";
import {Map} from "./HuntingMap";
import ActiveHuntings from "./ActiveHuntings";
import React from "react";

export default class HuntingsWithMap extends Component {

    constructor(props) {
        super(props);
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
        let huntings = this.props.huntings;
        let _hunting = huntings.find(a => a._id === area._id);
        if (_hunting) {
            cb(_hunting);
            this.props.updateHuntings(huntings)
        }
    };

    render() {
        return (
            <div>
                <div className="row">
                    <Map
                        containerElement={
                            <div style={{height: `500px`}}/>
                        }
                        mapElement={
                            <div style={{height: `500px`}}/>
                        }
                        huntings={this.props.huntings}
                        showInfo={this.showInfo}
                        closeInfo={this.closeInfo}
                    />
                </div>
                <div className="row">
                    <ActiveHuntings
                        huntings={this.props.huntings}
                        showInfo={this.showInfo}
                        closeInfo={this.closeInfo}
                        postHook={this.props.refresh}
                        userId={this.props.loggedUser}
                    />
                </div>
            </div>
        )
    }
}