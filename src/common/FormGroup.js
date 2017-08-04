import React, {Component} from 'react'

export default class FormGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: ""
        }
    }

    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.labelFor}>{this.props.label}</label>
                <input className="form-control"
                       type={this.props.type}
                       id={this.props.labelFor}
                       placeholder={this.props.label}
                       required="required"
                       name={this.props.name}
                       value={this.fieldValue}
                       onChange={this.props.handleInputChange}/>
            </div>
        )
    }
}
