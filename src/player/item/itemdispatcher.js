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
 * @date 2/10/2016
 */

var _ = require('lodash');

//import { logger } from '../../libs/common/logger';
var promiseutils = require('../../../libs/common/promiseutils');

import ItemActionFactory from './itemactionfactory';

/**
 * @class ItemDispatcher
 *
 * @module interactives/player/item
 *
 * @classdesc
 *  ItemDispatcher object is a wrapper around store provising descripive
 *  functions for actions on the item.
 *  The obhect is meant to be instantiated by the player and use setStore()
 *  to set the store to wrap.
 *
 * @constructor
 *
 * @param {object} settings
 *
 */
export default class ItemDispatcher
{
    /**
     * constructor
     * @param {Object} evaluator - Reference to the evaluator object.
     */
    constructor(config)
    {
        /**
         * @type actionFactory
         */
        this.actionFactory_;

        /**
         * @type Evaluator
         */
        this.evaluator_;

        if (config) {
            if(config.actionFactory) {
                this.actionFactory_ = config.actionFactory;
            } else {
                throw new Exception('actionFactory not provided')
            }
            if(config.evaluator) {
                this.evaluator_ = config.evaluator;
            } else {
                throw new Exception('evaluator not provided')
            }
        }

        /**
         * @type {PubSub} for eventing
         */
        this.pubsub = (config && config.pubsub) ? config.pubsub : null;
    }

    /**
     * Sets the Store reference
     *
     */
    setStore(store)
    {
        this.store_ = store;
    }


    /**
     * updates state of a component
     *
     * @param {string} associationId -
     * @param {string} componentId -
     * @param {Object} componentState  - the component state
     */
    updateState(associationId, componentId, componentState)
    {
        let self = this;
        return promiseutils.createPromise( function(resolve, reject) {
            // @todo - implement
            let retval = this.store_.dispatch(
                this.actionFactory_.updateState(componentId, componentState)
            );
            // Add mechanism to update state in the system of records
            resolve(retval);
        }.bind(this));
    }

    /**
     * Evaluate the current state
     *
     * @param {string} associationId  - the nodeId
     */
    evaluate(associationId)
    {
        let self = this;

        let submissionTimestamp = new Date();

        // components states are Immutablejs
        let componentStates = this.store_.getState('components');

        // merge states of all the components into one single KV Object
        // This will become th student's submission object
        var itemState = {};
        for (var componentId in componentStates) {
            itemState = _.assignIn(itemState, componentStates[componentId]);
        }

        // Evaluator can be either local or remote proxy
        return self.evaluator_.evaluate(associationId, itemState)
        .then( function(evalResult) {
            // @todo - obtain the componentId from the fieldName
            let evalDetails = {
                submission: {
                    timestamp: submissionTimestamp,
                    fields: itemState
                },
                evalResult: evalResult
            }
            var dispResult = self.store_.dispatch(self.actionFactory_.appendEvalDetails(evalDetails));
            console.log('dispResult: ' + JSON.stringify(dispResult));
            return evalDetails;
        })
        .then(function(evalDetails) {
            console.log("yay!" + JSON.stringify(evalDetails));
            if (self.pubsub) {
                // publish event
                // @todo - change string literals to constants
                self.pubsub.publish('submission-responded', {
                    associationId: associationId,
                    data: evalDetails
                });
            }
            // Re-return
            return evalDetails;
        });
    }

    /**
     * @deprecated
     */
    evaluate1(associationId)
    {
        let self = this;
        return this.store_.dispatch(
            this.actionFactory_.evaluate(associationId)
        ).then(function(data){
            console.log("yay!" + JSON.stringify(data));
            if (self.pubsub && data.type == 'ITEM_APPEND_EVALDETAILS') {
                // publish event
                // @todo - change string literals to constants
                self.pubsub.publish('submission-responded', {
                    associationId: associationId,
                    data: data.evalDetails
                });
            }
            // Re-return
            return data;
        });
    }

    /**
     * Adds a message
     */
    appendMessage(message)
    {
        return this.store_.dispatch(
            this.actionFactory_.appendMessage(message)
        );
    }

}

ItemDispatcher.prototype.name = 'itemDispatcher';
