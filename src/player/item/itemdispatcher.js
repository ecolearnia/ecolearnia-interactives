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
         * @type {PubSub} for eventing
         */
        this.pubsub = (config && config.pubsub) ? config.pubsub : null;

        /**
         * @type {StoreFacade}
         * Set by the setState() method
         */
        this.store_;

        /**
         * @type {ActivityProvider}
         */
        this.activityProvider_;

        /**
         * @type {ActionFactory}
         */
        this.actionFactory_;

        /**
         * @type {Evaluator}
         */
        this.evaluator_;

        if(config && config.activityProvider) {
            this.activityProvider_ = config.activityProvider;
        }
        if(config && config.actionFactory) {
            this.actionFactory_ = config.actionFactory;
        } else {
            throw new Error('actionFactory not provided');
        }
        if(config && config.evaluator) {
            this.evaluator_ = config.evaluator;
        } else {
            throw new Error('evaluator not provided');
        }
    }

    /**
     * Sets the Store reference
     * @param {StoreFacade} store;
     */
    setStore(store)
    {
        this.store_ = store;
    }

    /**
     * Sets the Store reference
     * @param {StoreFacade} store;
     */
    timestampStart(timestamp)
    {
        return this.store_.dispatch(
            this.actionFactory_.timestampStart(timestamp)
        );
    }

    /**
     * Sets the Store reference
     * @param {StoreFacade} store;
     */
    timestampStop(timestamp)
    {
        // @todo - put a guard so the dispatch is skipped when the student has
        // completed the assessment. I.e. Either no more attempts left or last
        // evaluation was "pass"
        return this.store_.dispatch(
            this.actionFactory_.timestampStop(timestamp)
        );
    }

    /**
     * Restores (replaces) timestamps
     *
     * @param {Array<>} timestamps -
     */
    restoreTimestamps(timestamps)
    {
        return this.store_.dispatch(
            this.actionFactory_.restoreTimestamps(timestamps)
        );
    }

    /**
     * Updates state of a component.
     * It also saves in the system or records
     *
     * @param {string} activityId -
     * @param {string} componentId -
     * @param {player.FieldCollection} componentState  - the component state
     * @param {boolean} skipSave  - If true, skip saving in the system or records
     */
    updateState(assignmentId, activityId, componentId, componentState, skipSave)
    {
        let self = this;
        // register stop
        // @todo - currently this tirggers additional re-render
        self.timestampStop();
        return promiseutils.createPromise( function(resolve, reject) {
            // @todo - implement
            let retval = this.store_.dispatch(
                this.actionFactory_.updateState(componentId, componentState)
            );

            let itemState = this.store_.getState('components');
            if (!skipSave && this.activityProvider_) {
                // Save the item state in the system of records
                let timestamps = this.store_.getState('timestamps');
                this.activityProvider_.saveState(assignmentId, activityId, itemState, timestamps);
            }
            resolve(retval);
        }.bind(this));
    }

    /**
     * Evaluate the current state
     *
     * @param {string} activityId  - the activityId
     * @return {player.EvalDetails}
     */
    evaluate(assignmentId, activityId)
    {
        let self = this;

        // register stop
        // Commented out: last state update will be taken as the time stop
        // Time until submit button is presses will not be taken into account
        // If timestampStop needs to be enabled here, then  evaluate() should
        // save the timestamp in the system of records
        // self.timestampStop();

        // components states are Immutablejs
        let componentStates = this.store_.getState('components');

        // merge states of all the components into one single KV Object
        // This will become th student's submission object
        var itemState = {};
        for (var componentId in componentStates) {
            itemState = _.assignIn(itemState, componentStates[componentId]);
        }

        let startTime = this.store_.getState('timestamps').start;
        let timestamp = new Date();
        var submissionDetails = {
            timestamp: timestamp,
            secondsSpent: this.calculateTimeSpent(),
            fields: itemState
        };

        self.pubsub && self.pubsub.publish('submission:beforeProcess', {
            activityId: activityId,
            data: itemState
        });

        // Evaluator can be either local or remote proxy
        // The evaluator is expected to save activity state with the evalResult
        return self.evaluator_.evaluate(assignmentId, activityId, submissionDetails)
        .then( function(evalResult) {
            // @todo - obtain the componentId from the fieldName
            let evalDetails = {
                submission: submissionDetails,
                evalResult: evalResult
            };
            var dispatchResult = self.appendEvalDetails(evalDetails);
            //console.log('dispatchResult: ' + JSON.stringify(dispResult));
            return evalDetails;
        })
        .then(function(evalDetails) {
            //console.log("yay!" + JSON.stringify(evalDetails));
            if (self.pubsub) {
                // publish event
                // @todo - change string literals to constants
                self.pubsub.publish('submission:responded', {
                    activityId: activityId,
                    data: evalDetails
                });
            }
            // Re-return
            return evalDetails;
        })
        .catch(function(error) {
            // @todo
            self.pubsub && self.pubsub.publish('error', {
                activityId: activityId,
                error: error
            });
            //alert(error);
            throw error;
        });
    }

    /**
     * Adds evaluation details
     * This method is called exclusively by the state restoration process
     */
    appendEvalDetails(evalDetails)
    {
        return this.store_.dispatch(
            this.actionFactory_.appendEvalDetails(evalDetails)
        );
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

    /**
     * Returns the summation of elapsedSeconds in the state('timestamps')
     */
    calculateTimeSpent()
    {
        let timestamps = this.store_.getState('timestamps');

        console.log('** timestamps: ' + JSON.stringify(timestamps));

        let elapsedSecondsSigma = 0;
        timestamps.forEach(function(element){
            elapsedSecondsSigma += element.elapsedSeconds;
        });
        console.log('** elapsedSecondsSigma: ' + elapsedSecondsSigma);

        return elapsedSecondsSigma;
    }
}

ItemDispatcher.prototype.name = 'itemDispatcher';
