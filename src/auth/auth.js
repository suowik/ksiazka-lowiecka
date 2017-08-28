import SHA256 from 'crypto-js/sha256'
import globals from '../common/globals.js'
let API_URL = globals['API_URL'];
import request from 'request'
import moment from 'moment'

class LoggedUser {
    constructor(userId, roles, token, lastLogin) {
        this.userId = userId;
        this.roles = roles;
        this.token = token;
        this.lastLogin = lastLogin;
    }

    needsLogin() {
        let diff = moment().diff(this.lastLogin, 'minutes');
        return diff > 45
    }

}

function getUser() {
    let loggedUser = localStorage.loggedUser;
    let {userId, roles, token, lastLogin} = JSON.parse(loggedUser);
    return new LoggedUser(userId, roles, token, moment(lastLogin, 'YYYY-MM-DD HH:mm'))
}

export default {
    login(email, pass, cb) {
        cb = arguments[arguments.length - 1];
        if (localStorage.loggedUser
            && !getUser().needsLogin()) {
            if (cb) cb(true);
            this.onChange(true);
            return
        }
        login(email, pass, (res) => {
            if (res.authenticated) {
                localStorage.loggedUser = JSON.stringify(new LoggedUser(res.userId, res.roles, res.token, moment().format('YYYY-MM-DD HH:mm')));
                if (cb) cb(true);
                this.onChange(true)
            } else {
                if (cb) cb(false);
                this.onChange(false)
            }
        })
    },

    logout(cb) {
        delete localStorage.loggedUser;
        if (cb) cb();
        this.onChange(false)
    },

    loggedUser(){
        return JSON.parse(localStorage.loggedUser)
    },

    loggedIn() {
        return !!localStorage.loggedUser && !getUser().needsLogin()
    },

    onChange() {
    }
};

function login(login, password, cb) {
    let requestData = {
        method: 'post',
        json: true,
        body: {
            login: login,
            password: SHA256(password).toString()
        },
        url: API_URL + '/login'
    };
    request(requestData, (err, res, body) => {
        if (err) cb({authenticated: false});
        if (res.statusCode === 200 && body.success === true && body.active === true) {
            cb({
                authenticated: true,
                roles: body.roles,
                userId: body.userId,
                token: body.token
            })
        } else {
            cb({authenticated: false});
        }
    });
}