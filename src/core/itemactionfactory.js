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
import {dehydrate} from '../../libs/common/utils';
//var logger = require('../../libs/common/logger');

import PubSub from '../../libs/common/pubsub';


/**
 * @class ItemActionFactory
 *
 * @module interactives/core
 *
 * @classdesc
 *  ItemActionFactory creates item actions for the Redux-based StateFacade.
 *
 */
export default class ItemActionFactory
{
    /**
     * constructor
     * @param {Object} evaluator - Reference to the evaluator object.
     */
    constructor(evaluator)
    {
        this.evaluator_ = evaluator;
    }

    appendMessage(message)
    {
        return {
            type: 'ITEM_APPEND_MESSAGE',
            message: message
        };
    }
    /**
     * Returns action for update state
     *
     * @param {string} componentId  - the ID of the component to update
     * @param {Object} state  - the state of the component
     */
    updateState(componentId, state)
    {
        return {
            type: 'ITEM_UPDATE_STATE',
            componentId: componentId,
            state: state
        };
    }

    /**
     * Returns action for update Evaluation result
     *
     * @param {Object} evalDetails  - the result of the evaluation
     */
    appendEvalDetails(evalDetails)
    {
        return {
            type: 'ITEM_APPEND_EVALDETAILS',
            evalDetails: evalDetails
        };
    }


    /**
     * Asynchronous evaluation of an item's state (submission)
     *
     * @param {string} associationId  - ID of the item that is currently being played
     */
    evaluate(associationId)
    {
        var self = this;
        return function (dispatch, getState) {
            let submissionTimestamp = new Date();

            // components states are Immutablejs
            let componentStates = getState().components.toJS();

            // merge states of all the components into one single KV Object
            // This will become th student's submission object
            var itemState = {};
            for (var componentId in componentStates) {
                itemState = _.assignIn(itemState, componentStates[componentId]);
            }
            // add flatten nested objects,
            // eg. field1: {key, value} into field1_key and field1_value
            let itemState2 = {};
            _.assign(itemState2, itemState, dehydrate(itemState, null, '_'));

            console.log(itemState2);

            // Evaluator can be either local or remote proxy
            return self.evaluator_.evaluate(associationId, itemState2)
                .then(
                    (evalResult) => {
                        // @todo - obtain the componentId from the fieldName
                        let evalDetails = {
                            submission: {
                                timestamp: submissionTimestamp,
                                fields: itemState
                            },
                            evalResult: evalResult
                        }
                        return dispatch(self.appendEvalDetails(evalDetails))
                    }
                )
                .catch(
                    (error) => {
                        return dispatch(self.appendMessage({type: 'Error', associationId, error}))
                    }
                );
        };
    }
}
