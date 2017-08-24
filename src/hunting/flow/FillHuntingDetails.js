import React, {Component} from 'react'

export default class FillHuntingDetails extends Component {
    render() {
        return (
            <div>
                <button className="btn btn-primary" onClick={(e) => this.props.transitionHandler("next")}>Dalej</button>
                <button className="btn btn-primary" onClick={(e) => this.props.transitionHandler("prev")}>Wstecz</button>
                Fill
            </div>
        )
    }
}
