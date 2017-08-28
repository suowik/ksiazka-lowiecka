import React, {Component} from 'react';
import {Modal} from "react-bootstrap";

class FormGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        e.preventDefault();
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            value: value
        });
        this.props.handleInputChange(name, value)
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
                       value={this.state.value}
                       onChange={this.handleChange}
                />
            </div>
        )
    }
}


export default class User extends Component {

    handleChange = (e) => {
        e.preventDefault();
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            value: value
        });
        this.props.handleInputChange(name, value)
    }

    render() {
        return (
            <Modal show={this.props.visible} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Myśliwy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.props.handleUpdate}>
                        <FormGroup label="Imię"
                                   labelFor="name"
                                   type="text"
                                   name="name"
                                   value={this.props.data.name}
                                   handleInputChange={this.props.handleInputChange}/>
                        <FormGroup label="Nazwisko"
                                   labelFor="surname"
                                   type="text"
                                   value={this.props.data.surname}
                                   name="surname"
                                   handleInputChange={this.props.handleInputChange}/>
                        <FormGroup label="Email"
                                   labelFor="login"
                                   type="email"
                                   name="login"
                                   value={this.props.data.login}
                                   handleInputChange={this.props.handleInputChange}/>
                        <FormGroup label="Numer telefonu"
                                   labelFor="phone"
                                   type="number"
                                   name="address.phone"
                                   value={this.props.data.address.phone}
                                   handleInputChange={this.props.handleInputChange}/>
                        <FormGroup label="Ulica"
                                   labelFor="street"
                                   type="text"
                                   name="address.street"
                                   value={this.props.data.address.street}
                                   handleInputChange={this.props.handleInputChange}/>
                        <FormGroup label="Miasto"
                                   labelFor="city"
                                   type="text"
                                   name="address.city"
                                   value={this.props.data.address.city}
                                   handleInputChange={this.props.handleInputChange}/>
                        <div className="form-group">
                            <label htmlFor="active">Aktywowany</label>
                            <input className="form-control"
                                   type="checkbox"
                                   id="active"
                                   name="active"
                                   checked={this.props.data.active}
                                   onChange={this.handleChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Zapisz</button>
                    </form>
                </Modal.Body>
            </Modal>
        )
    }
}