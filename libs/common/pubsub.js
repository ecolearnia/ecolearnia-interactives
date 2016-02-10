/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var Rx = require('rx');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of PubSub class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var hasOwnProp = {}.hasOwnProperty;

function createName (name) {
    return '$' + name;
}

/**
 * @class SubPub
 *
 * @module interactives/core
 *
 * @classdesc
 *  PubSub, the message bus.
 *  It wraps a third party subpub library.
 *
 * @todo - Implement!
 *
 * @constructor
 */
export class PubSub
{
    constructor(props)
    {
        // Using Backbone's event
        this.subjects = {};
    }

    subscribe (topic, handler)
    {
        var fnName = createName(topic);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        return this.subjects[fnName].subscribe(handler);
    }

    /**
     * Removes subscription
     *
     * @param {string} topic
     * @param {function} handler
     */
    unsubscribe (topic, handler)
    {
        var fnName = createName(topic);
        if (this.subjects[fnName]) {
            this.subjects[fnName].dispose();
            delete this.subjects[fnName];
        }
    }

    /**
     * Publish message
     *
     * @param {string} topic
     * @param {object} message
     */
    publishRaw (topic, data)
    {
        var fnName = createName(topic);
        this.subjects[fnName] || (this.subjects[fnName] = new Rx.Subject());
        this.subjects[fnName].onNext(data);

    }

    /**
     * Publish message
     *
     * @param {string} topic
     * @param {string} sourceItemId
     * @param {string} sourceComponent
     * @param {object} payload
     */
    publish (topic, sourceItemId, sourceComponentId, type, payload) {
        var message = {
            timestamp: new Date(),
            source: {
                itemId: sourceItemId,
                componentId: sourceComponentId
            },
            type: type,
            payload: payload
        };
        this.publishRaw(topic, message);
    }

    dispose() {
        var subjects = this.subjects;
        for (var prop in subjects) {
            if (hasOwnProp.call(subjects, prop)) {
                subjects[prop].dispose();
            }
        }

        this.subjects = {};
    }
};
