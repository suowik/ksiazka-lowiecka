import React, {Component} from 'react'

export default class Flow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            flow: props.flow
        }
    }

    currentViewState = (current) => {
        return this.state.flow.viewStates.filter(f => f.viewState === current)[0]
    };

    transitionHandler = (transition) => {
        let t = this.currentViewState(this.state.flow.flowState).transitions.filter(t => t.on === transition)[0];
        let flow = this.state.flow;
        flow.flowState = t.to;
        this.setState({
            flow: flow
        })
    };

    render(data) {
        let ViewStateRenderer = this.currentViewState(this.state.flow.flowState).renderer;
        return (
            <ViewStateRenderer data={data} transitionHandler={this.transitionHandler}/>
        )
    }
}