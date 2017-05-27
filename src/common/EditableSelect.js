import React, {Component} from 'react';

class EditableSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editable: props.editable,
            value: props.value,
            renderWhenEditable: props.renderWhenEditable,
            id: props.identifier
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            editable: props.editable,
            value: props.value,
            renderWhenEditable: props.renderWhenEditable,
            id: props.identifier
        });
    }

    makeEditable() {
        this.setState({
            editable: true
        })
    }

    render() {
        let res = null;
        if (this.state.editable) {
            res = this.state.renderWhenEditable
        } else {
            res = <span key={this.state.id} onDoubleClick={(e)=> this.makeEditable()}>{this.state.value}</span>
        }
        return (<span>{res}</span>);
    }
}

export default EditableSelect;
