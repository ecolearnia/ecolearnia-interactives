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
 * @date 5/13/15
 */

import _ from 'lodash';

 /**
  * @class AbstractResource
  *
  * @module studio
  *
  * @classdesc
  *  A default resource .
  *
  */
export default class ResourceService
{
    /**
     * @param {object} config
     */
    constructor(config)
    {
        /**
         * The logger
         */
        //this.logger_ = logger.getLogger('Composition');

        /**
         * The base url of the service
         * @type {string}
         */
        this.baseUrl_ = config.baseUrl;
        if (this.baseUrl_.charAt(this.baseUrl_.length-1) != '/') {
            this.baseUrl_ += '/';
        }

        /**
         * Default http request options (fetch options)
         * @type {Object} @see https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
         */
        this.defaultRequestOpts_ = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };

    }

     /**
      * Gets a resource
      * @param
      */
    get(params)
    {
        if (!params || !params._id) {
            Promise.reject(new Error('_id not provided'));
        }
        return this.doRequest({method: 'GET'}, params._id, params);
    }

     /**
      * Saves a resource (POST)
      * Inserts new (POST) if id was not provided, updates (PUT) otherwise
      * @param
      */
    save(params, data)
     {
        var method = 'POST';
        var id = '';
        if (params && params._id) {
            method = 'PUT';
            id = params._id;
        }

        return this.doRequest({method: method, body: data}, id, params);
    }

     /**
      * Queries resources (GET list)
      * @param
      */
    query(params)
    {
        return this.doRequest({method: 'GET'}, null, params);
    }

    /**
     * Deletes a resource (DELETE)
     * @param
     */
    delete(params)
    {
        return this.doRequest({method: 'DELETE'}, params._id, params);
    }

    /**
     * Same as remove
     */
    remove(params)
    {
        return this.delete(params);
    }

    /**
     * Returns a query string  excluding the _id which should be used in the
     * URL path.
     * @param {Map.<string, string>} key value pairs
     */
    buildQueryString(params)
    {
        var queryStrings = [];
        for(var key in params)
        {
            if (key !== '_id') {
                queryStrings.push(key + '=' + encodeURIComponent(params[key]));
            }
        }
        if (queryStrings.length > 0) {
            return '?' + queryStrings.join('&');
        }
        return '';
    }

    buildCallOpts(opts)
    {
        let optParams = opts || {};
        let optsMerged  = {};
        _.assign(optsMerged, optParams, this.defaultRequestOpts_);
        return optsMerged;
    }

    /**
     * Makes an http request
     * @param {object} opts - the options
     * @param {!string} path - (optional) path to append to the URL, usually
     *         the id of the resource
     * @param {!Object} queryParams - (optional) key-value pairs for query string
     */
    doRequest(opts, path, params)
    {
        let optParams = this.buildCallOpts(opts);
        let pathParam = path || '';
        var qstring = this.buildQueryString(params);
        return fetch(this.baseUrl_ + pathParam + qstring, optParams)
            .then(checkStatus)
            .then(response => response.json());
    }
}

function checkStatus(response)
{
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        var error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}
