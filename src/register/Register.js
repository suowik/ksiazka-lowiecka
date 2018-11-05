import React, {Component} from "react";
import SHA256 from 'crypto-js/sha256'
import {hashHistory} from 'react-router'
import {notProtectedPost} from '../common/requests.js'
import FormGroup from '../common/FormGroup.js'


export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formData: {
                login: "",
                password: "",
                repeatPassword: "",
                name: "",
                surname: "",
                phone: "",
                street: "",
                city: ""
            },
            isValid: true,
            validationMessage: ""
        };
        this.register = this.register.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        let formData = this.state.formData;
        formData[name] = value;
        this.setState({
            formData: formData
        })

    }

    register(e) {
        e.preventDefault();
        if (this.state.formData.password !== this.state.formData.repeatPassword) {
            this.setState({
                isValid: false,
                validationMessage: "Podane hasła różnią się",
                formData: {
                    repeatPassword: ""
                }
            });
            return;
        } else {
            this.setState({
                isValid: true
            })
        }
        let registrationData = {
            login: this.state.formData.login,
            password: SHA256(this.state.formData.password).toString(),
            name: this.state.formData.name,
            surname: this.state.formData.surname,
            active: false,
            address: {
                phone: this.state.formData.phone,
                street: this.state.formData.street,
                city: this.state.formData.city
            }
        };
        notProtectedPost('/users', registrationData)((err, res, body) => {
            if (res.statusCode !== 200) {
                this.setState({
                    isValid: false,
                    validationMessage: "Taki użytkownik już istnieje"
                });
            } else {
                hashHistory.push('/login')
            }
        });
    }

    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">Zarejestruj się</div>
                <div className="panel-body">
                    {!this.state.isValid &&
                    <div className="alert alert-warning" role="alert">{this.state.validationMessage}</div>}
                    <form onSubmit={this.register}>
                        <FormGroup label="Imię"
                                   labelFor="name"
                                   type="text"
                                   name="name"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Nazwisko"
                                   labelFor="surname"
                                   type="text"
                                   name="surname"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Email"
                                   labelFor="login"
                                   type="email"
                                   name="login"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Hasło"
                                   labelFor="password"
                                   type="password"
                                   name="password"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Potwórz hasło"
                                   labelFor="password2"
                                   type="password"
                                   name="repeatPassword"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Numer telefonu"
                                   labelFor="phone"
                                   type="text"
                                   name="phone"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Ulica"
                                   labelFor="street"
                                   type="text"
                                   name="street"
                                   handleInputChange={this.handleInputChange}/>
                        <FormGroup label="Miasto"
                                   labelFor="city"
                                   type="text"
                                   name="city"
                                   handleInputChange={this.handleInputChange}/>
                        <button type="submit" className="btn btn-primary">Zarejestruj się</button>
                    </form>
                </div>
            </div>)
    }

}


