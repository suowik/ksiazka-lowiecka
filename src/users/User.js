import React, {Component} from 'react';
import {Modal} from "react-bootstrap";

export default class User extends Component {
    render() {
        return (
            <Modal show={this.props.visible} onHide={this.props.close}>
                <Modal.Header closeButton>
                    <Modal.Title>Myśliwy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.addHuntedAnimals}>

                    </form>
                </Modal.Body>
            </Modal>
        )
    }
}