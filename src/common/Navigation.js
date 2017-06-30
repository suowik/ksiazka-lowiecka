import React, {Component} from 'react';
import HasRole from './HasRole.js'
import auth from '../auth/auth.js'

class Navigation extends Component {



    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Menu</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="#">Książka łowiecka</a>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li className="active"><a href="#/book">Dziennik</a></li>
                            <HasRole levelRequired="admin">
                                <li><a href="#/areas">Obszary łowieckie</a></li>
                            </HasRole>
                            <HasRole levelRequired="admin">
                                <li><a href="#/dictionaries">Definicje zwierząt</a></li>
                            </HasRole>
                            <HasRole levelRequired="admin">
                                <li><a href="#/users">Użytkownicy</a></li>
                            </HasRole>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            {auth.loggedIn() && <li><a href="#/logout">Wyloguj</a></li>}
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}


export default Navigation