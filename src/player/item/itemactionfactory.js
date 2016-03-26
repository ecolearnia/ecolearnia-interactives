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
import {dehydrate} from '../../../libs/common/utils';
var logger = require('../../../libs/common/logger');

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
 * @class ItemActionFactory
 *
 * @module interactives/player/item
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
     * Returns action for registering a start timestamp
     *
     * @param {Date!} timestamp  - Optiona: the timestamp
     */
    timestampStart(timestamp)
    {
        return {
            type: 'REGISTER_START',
            timestamp: timestamp
        };
    }

    /**
     * Returns action for registering a stop timestamp
     *
     * @param {Date!} timestamp  - Optiona: the timestamp
     */
    timestampStop(timestamp)
    {
        return {
            type: 'REGISTER_STOP',
            timestamp: timestamp
        };
    }

    /**
     * Returns action for restoring (replacing) timestamps
     *
     * @param {Date!} timestamp  - Optiona: the timestamp
     */
    restoreTimestamps(timestamps)
    {
        return {
            type: 'RESTORE_TIMESTAMPS',
            timestamps: timestamps
        };
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

}
