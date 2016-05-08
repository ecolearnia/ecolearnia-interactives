/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.2
 *
 * @fileoverview
 *  This file includes the definition of ItemPlayer class.
 *
 * @author Young Suk Ahn Park
 * @date 5/4/16
 */

import Cookies from 'js-cookie';
import ResourceService from '../common/resourceservice';
import promiseutils from '../common/promiseutils';


var COOKIE_NAME = 'ecofy_token';

var COOKIE_OPTIONS = {
    path: '/'
};

export default class AssignmentPlayer
{
    /**
     * @param {object} config
     */
    constructor(config)
    {
        this.basePath = config.basePath; // '/api'
        this.resourceService = new ResourceService(config);

        this.ecofyToken = null; // Same as the cookie('ecofy_token')
        this.account = null;
    }


    /**
     * isAuthenticated
     */
    isAuthenticated()
    {
        if (this.getToken() || this.getAccount())
            return true;
        return false;
    }

    /**
     * getToken
     */
    getToken()
    {
        if (!this.ecofyToken) {
            this.ecofyToken = Cookies.get(COOKIE_NAME);
        }
        return this.ecofyToken;
    }

    /**
     * Sets token
     */
    setToken(value)
    {
        this.ecofyToken = value;
        if (!value) {
            Cookies.remove(COOKIE_NAME, COOKIE_OPTIONS);
        } else {
            //$http.defaults.headers.common.Authorization = this.ecofyToken;
            Cookies.set(COOKIE_NAME, value, COOKIE_OPTIONS);
        }
    }

    /**
     * getAccount
     */
    getAccount()
    {
        return this.account;
    }

    /**
     *
     */
    setAccount(account)
    {
        this.account = account;
    }

    setSession(token, account)
    {
        this.setToken(token);
        this.setAccount(account);
    }

    /**
     * @param {Object} account: {username, password}.
     */
    signup(account)
    {
        var self = this;
        return this.resourceService.doRequest({method: 'POST', body: JSON.stringify(account)}, 'signup')
        .then(function(response) {
            if (response) {
                self.setSession(response.token, response.auth.account);
                return self.getAccount();
            } else {
                // Login failed (bad id or password)
                return null;
            }
        })
        .catch(function(error) {
            // Error wrapped by $http containing config, data, status, statusMessage, etc.
            //if (error)
            throw error;
        });
    }

    /**
     * @param {Object} credentials: {username, password}.
     */
    signin(credentials)
    {
        var self = this;
        return this.resourceService.doRequest({method: 'POST', body: JSON.stringify(credentials)}, 'signin')
        .then(function(response) {
            if (response) {
                self.setSession(response.token, response.auth.account);
                return self.getAccount();
            } else {
                // Login failed (bad id or password)
                return null;
            }
        })
        .catch(function(error) {
            // Error wrapped by $http containing config, data, status, statusMessage, etc.
            //if (error)
            throw error;
        });
    }

    signout() {
        var self = this;
        return this.resourceService.doRequest(
            {method: 'POST', headers: { 'Authorization': self.getToken() }},
            'signout')
        /*return $http({
                    method: 'POST',
                    url: basePath + '/signout',
                    headers: { 'Authorization': self.getToken() }
                })
                */
        .then(function(response) {
            self.setToken(null);
            self.setAccount(null);
        });
    }


    /**
     * fetchMyAccount
     * Fetches the current user account from token
     */
    fetchMyAccount() {
        var self = this;
        //return $q(function(resolve, reject) {
        return promiseutils.createPromise( function(resolve, reject) {
            if (self.getAccount()) {
                return resolve(self.getAccount());
            }
            if (self.getToken()) {
                this.resourceService.doRequest(
                    {method: 'GET', headers: { 'Authorization': self.getToken() }},
                    'myaccount')
                /*$http({
                    method: 'GET',
                    url: basePath + '/myaccount',
                    headers: { 'Authorization': self.getToken() }
                })*/
                .then(function(response) {
                    self.setAccount(response); // account
                    resolve(self.getAccount());
                })
                .catch(function(error) {
                    reject (error);
                });
            } else {
                // no token
                reject(null);
            }
        });
    }

}
