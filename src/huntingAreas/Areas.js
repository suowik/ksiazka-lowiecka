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
                </tr>
            )}
            </tbody>
        </table>);
    }
}
