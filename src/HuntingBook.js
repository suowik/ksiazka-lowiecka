import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import {OverlayTrigger} from 'react-bootstrap';
import {Popover} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';

const huntedAnimals = (
    <Popover id="popover-positioned-bottom" title="Upolowane zwierzęta">
        <ul>
            <li>Dzik (2)</li>
            <li>Lis (22)</li>
            <li>Kaczka (92)</li>
        </ul>
    </Popover>
);


class HuntingBook extends Component {

    render() {
        return (
            <div className="table-responsive">
                <table className="table table-bordered table-condensed">
                    <thead>
                    <tr>
                        <th colSpan={7}>
                            <Button>Wpisz się na polowanie</Button>
                        </th>
                    </tr>
                    <tr>
                        <th>Myśliwy</th>
                        <th>Data</th>
                        <th>Godzina rozpoczęcia</th>
                        <th>Godzina zakończenia</th>
                        <th>Upolowane zwierzęta</th>
                        <th>Rewir</th>
                        <th></th>
                    </tr>

                    </thead>
                    <tbody>
                    <tr>
                        <td>Jan Kowalski</td>
                        <td>26.06.2017</td>
                        <td>14:10</td>
                        <td>16:15</td>
                        <td>
                            <OverlayTrigger trigger="click" placement="left" overlay={huntedAnimals}>
                                <Button>+</Button>
                            </OverlayTrigger>
                        </td>
                        <td>Tarnów</td>
                        <td>
                            <Button>Edytuj</Button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }

}

export default HuntingBook