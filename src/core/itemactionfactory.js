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

var namespace = {};
/**
 * @typedef {{
 *    <field0>: {
 *      key: (string | number),
 *      value: (string | number | boolean | array),
 *    },
 *    <field1>: {
 *      key: (string | number),
 *      value: (string | number | boolean | array),
 *    },...
 *  }} ComponentState
 */
namespace.ComponentState;

/**
 * @typedef {{
 *    submission: {
 *      timestamp: (Date),
 *      "fields": {
 *        "field1": {
 *          "key": (string | number),
 *          "value": (string | number),
 *        }
 *      }
 *    },
 *    evalResult: {
 *      "field1": {
 *        "score": (number),
 *        "feedback": (string),
 *      }
 *    }
 *  }} EvalDetails
 *
 *  Example:
 *    "submission": {
 *      "timestamp": "20160213T13:25:00.23",
 *      "fields": {
 *        "field1": {
 *          "key": "ans1",
 *          "value": "Earth",
 *        }
 *      }
 *    },
 *    "evalResult": {
 *      "field1": {
 *        "score": 1,
 *        "feedback": "You are correct!",
 *      }
 *    }
 *  }
 */
namespace.EvalDetails;

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
    constructor()
    {
        //this.evaluator_ = evaluator;
    }

    /**
     * Returns action for append message
     *
     * @param {string} message  - the message to be displayed
     */
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
     * @param {ComponentState} state  - the state of the component
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
     * @param {EvalDetails} evalDetails  - the result of the evaluation
     *
     */
    appendEvalDetails(evalDetails)
    {
        return {
            type: 'ITEM_APPEND_EVALDETAILS',
            evalDetails: evalDetails
        };
    }


    /**
     * @deprecated The ItemDispatcher is handling the evaluation
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

            // Evaluator can be either local or remote proxy
            return self.evaluator_.evaluate(associationId, itemState)
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
                /* Defer the cath to the outter caller
                .catch(
                    (error) => {
                        return dispatch(self.appendMessage({type: 'Error', associationId, error}))
                    }
                )*/;
        };
    }
}
