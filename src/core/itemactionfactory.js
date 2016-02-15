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
     * @param {string} associationId  - the ID of the item to update
     * @param {Object} evalResult  - the result of the evaluation
     */
    updateEvalResult(componentId, evalResult)
    {
        return {
            type: 'ITEM_UPDATE_EVALRESULT',
            componentId: componentId,
            evalResult: evalResult
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
            // components states are Immutablejs
            let componentStates = getState().components.toJS();

            // merge states of all the components into one single KV Object
            // This will become th student's submission object
            var itemState = {};
            for (var componentId in componentStates) {
                itemState = _.assignIn(itemState, componentStates[componentId]);
            }
            // flatten objects, eg. field1: {key, value} into field1_key and field1_value
            itemState = _.assignIn(itemState, dehydrate(itemState, null, '_'));

            console.log(itemState);

            // Evaluator can be either local or remote proxy
            return self.evaluator_.evaluate(associationId, itemState)
                .then(
                    (evalResult) => {
                        // @todo - obtain the componentId from the fieldName
                        let componentId = 'aggregate';
                        return dispatch(self.updateEvalResult(associationId, evalResult))
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
