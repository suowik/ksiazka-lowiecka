import React, {Component} from 'react';
import {Modal} from "react-bootstrap";
import Huntings from '../hunting/Huntings.js'

export default class UserHuntings extends Component {

    render() {
        return (
            <Modal show={this.props.visible} onHide={this.props.close} dialogClassName="big-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Polowania: {this.props.user.name} {this.props.user.surname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Huntings huntings={this.props.huntings} userId={null} showHunter={false} renderActions={false}/>
                </Modal.Body>
            </Modal>
        )
    }
}