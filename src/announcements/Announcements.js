import React, {Component} from "react";
import HasRole from '../common/HasRole.js'
import moment from 'moment';
import auth from '../auth/auth.js'
import {protectedGet, protectedPost, protectedDelete} from '../common/requests.js'

export default class Announcements extends Component {

    constructor(props) {
        super(props);
        this.state = {
            announcements: []
        }
    }

    loadAnnouncements = () => {
        let that = this;
        protectedGet("/announcements")((err, res, body) => {
            that.setState({
                announcements: body
            })
        })
    };

    componentDidMount() {
        this.loadAnnouncements()
    }

    handleRemove = (id) => {
        let that = this;
        protectedDelete(`/announcements`, {_id: id})(() => {
            that.loadAnnouncements()
        })
    };

    handleCreate = (announcement) => {
        let that = this;
        protectedPost("/announcements", announcement)(() => {
            that.loadAnnouncements()
        })
    };

    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <h3>Ogłoszenia</h3>
                    <HasRole levelRequired={"user"}>
                        <AnnouncementsTable announcements={this.state.announcements} handleRemove={this.handleRemove}/>
                    </HasRole>
                    <HasRole levelRequired={"admin"}>
                        <AddAnnouncementPanel handleCreate={this.handleCreate}/>
                    </HasRole>
                </div>
            </div>
        )
    }
}

class AddAnnouncementPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            userId: auth.loggedUser().userId
        }
    }

    render() {
        return (
            <form onSubmit={() => {
                this.props.handleCreate({
                    content: this.state.content,
                    userId: this.state.userId,
                    announced: moment().format("HH:mm DD-MM-YYYY")
                });
                this.setState({
                    content: ""
                })
            }}>
                <div className="form-group">
                    <label htmlFor="">Treść</label>
                    <textarea className="form-control" value={this.state.content}
                              onChange={e => this.setState({
                                  content: e.target.value
                              })}/>
                </div>
                <button type="submit" className="btn btn-primary">Dodaj</button>
            </form>
        );
    }
}

class AnnouncementsTable extends Component {
    render() {
        let announcements = this.props.announcements.sort((a, b) => {
            if (moment(a.announced, "HH:mm DD-MM-YYYY").isAfter(moment(b.announced, "HH:mm DD-MM-YYYY"))) {
                return -1
            }
            return 1
        });
        return (
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th>Data ogłoszenia</th>
                    <th>Treść</th>
                    <th>Zamieścił</th>
                    <HasRole levelRequired={"admin"}>
                        <th>Akcje</th>
                    </HasRole>
                </tr>
                </thead>
                <tbody>
                {announcements.map(announcement => {
                    return <tr key={announcement._id}>
                        <td>{announcement.announced}</td>
                        <td>{announcement.content}</td>
                        <td>{announcement.user.name} {announcement.user.surname}</td>
                        <HasRole levelRequired={"admin"}>
                            <td>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => this.props.handleRemove(announcement._id)}>Usuń ogłoszenie
                                </button>
                            </td>
                        </HasRole>
                    </tr>
                })}
                </tbody>
            </table>
        );
    }
}