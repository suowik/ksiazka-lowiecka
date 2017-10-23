import auth from '../auth/auth.js'
import globals from '../common/globals.js'
import request from 'request'

let API_URL = globals['API_URL'];

function protectedRequest(config) {
    let endpoint = config.endpoint.startsWith('/') ? config.endpoint : '/' + config.endpoint;
    let reqConfig = {
        method: config.method,
        url: API_URL + endpoint,
        body: config.body,
        headers: {'x-access-token': auth.loggedUser().token},
        json: true
    };
    return (cb) => {
        request(reqConfig, (err, res, body) => cb(err, res, body))
    }
}

export function protectedGet(endpoint) {
    return protectedRequest({method: 'get', endpoint: endpoint, body: null})
}

export function protectedPost(endpoint, body) {
    return protectedRequest({method: 'post', endpoint: endpoint, body: body})
}

export function notProtectedPost(e, body) {
    let config = {method: 'post', endpoint: e, body: body};
    let endpoint = config.endpoint.startsWith('/') ? config.endpoint : '/' + config.endpoint;
    let reqConfig = {
        method: config.method,
        url: API_URL + endpoint,
        body: config.body,
        json: true
    };
    return (cb) => {
        request(reqConfig, (err, res, body) => cb(err, res, body))
    }
}
