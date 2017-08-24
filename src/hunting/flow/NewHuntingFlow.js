import React from "react"
import moment from "moment";
import auth from "../../auth/auth.js"
import Flow from '../../flow/Flow.js'
import FillHuntingDetails from './FillHuntingDetails.js'
import SelectHuntingArea from './SelectHuntingArea.js'
import StartHunting from './StartHunting.js'

export default class NewHuntingFlow extends Flow {

    constructor(props) {
        super(props);
        let now = moment();

        this.state = {
            hunting: {
                startDate: now.format('YYYY-MM-DD'),
                startHour: now.format('HH:mm'),
                durationInHours: 1,
                huntingSpot: {
                    lat: 0.0,
                    lng: 0.0
                },
                userId: auth.loggedUser().userId
            },
            flow: {
                flowState: "SELECT_HUNTING_AREA",
                viewStates: [
                    {
                        viewState: "SELECT_HUNTING_AREA",
                        transitions: [
                            {on: "next", to: "FILL_HUNTING_DETAILS"}
                        ],
                        renderer: SelectHuntingArea
                    },
                    {
                        viewState: "FILL_HUNTING_DETAILS",
                        transitions: [
                            {on: "next", to: "START_HUNTING"},
                            {on: "prev", to: "SELECT_HUNTING_AREA"}
                        ],
                        renderer: FillHuntingDetails
                    },
                    {
                        viewState: "START_HUNTING",
                        transitions: [],
                        renderer: StartHunting
                    }
                ]
            }
        };
    }

    handleSelectHuntingSpot = (position) => {
        let hunting = this.state.hunting;
        hunting.huntingSpot = {
            lat: position.lat(),
            lng: position.lng()
        };
        this.setState({
            hunting: hunting
        })
    };

    render() {
        return super.render({hunting: this.state.hunting, handleSelectHuntingSpot: this.handleSelectHuntingSpot})
    }
}