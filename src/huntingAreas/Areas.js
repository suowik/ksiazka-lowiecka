import React, {Component} from "react";

export default class Areas extends Component {
    render() {
        return (<table className="table table-striped">
            <tbody>
            {this.props.areas.map(area =>
                <tr key={area._id}>
                    <td onMouseOver={this.props.showInfo(area)}
                        onMouseLeave={this.props.closeInfo(area)}>
                        <input className="form-control"
                               type="text" value={area.name}
                               onChange={this.props.updateAreaName(area)}/>
                    </td>
                    <td>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" checked={area.active} onChange={this.props.activateArea(area)}/> Aktywna?
                            </label>
                        </div>
                    </td>
                </tr>
            )}
            </tbody>
        </table>);
    }
}
