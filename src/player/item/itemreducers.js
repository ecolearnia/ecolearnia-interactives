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

import _ from 'lodash';
import Immutable from 'immutable';


/**
 * componentReducer
 *
 * @module interactives/player/item
 *
 * @desc
 *  Redux item reducer function for component.
 *  This reducer keeps the component state in the following structure:
 *  Immutable.Map.<{string} componentName, {player.FieldCollection} state >
 *  Example:
 *  "question1": {
 *    "field1": {
 *      "key": "ans1",
 *      "value": "Earth",
 *    }
 *  }
 *
 */
function componentReducer(state = Immutable.Map(), action)
{
    switch (action.type) {
        case 'ITEM_UPDATE_STATE':
            //console.log('state (pre)=' + JSON.stringify(state));
            var currState = state.get('fields') || {};
            //console.log('currState (pre)=' + JSON.stringify(currState));
            _.assign(currState, action.state);
            //console.log('currState (post)=' + JSON.stringify(currState));

            let newState = state.set('fields', currState);
            //console.log('state (post)=' + JSON.stringify(newState));
            return newState;
        default:
            return state;
    }
}

/**
 * evalResultReducer
 *
 * @module interactives/player/item
 *
 * @desc
 *  Redux item reducer function for evaluations (aka response processing)
 *  resulting from submission.
 *  This reducer keeps the evaluation details in the following structure:
 *  Immutable.List.<{player.EvalDetails}> }.
 *
 */
function evaluationReducer(state = Immutable.List(), action)
{
    switch (action.type) {
        case 'ITEM_APPEND_EVALDETAILS':
            return state.push(action.evalDetails);
        default:
            return state;
    }
}

/**
 * Calculates the delta in seconds of two dates
 */
function deltaSeconds(start, end)
{
    return Math.round( (end.getTime() - start.getTime()) / 1000);
}

/**
 * evalResultReducer
 *
 * @module interactives/player/item
 *
 * @desc
 *  Redux timestampReducer. Keeps track of timestamps.
 * Currently start is the only timestamp tracked.
 * The element in the list is of form:
 * {start: (Date), stop: (Date) [, elapsedSeconds: (number)] }
 * When REGISTER_START, a new entry is added with current time
 * as the start time. This action is for when item is rendered
 * for first time.
 * When REGISTER_STOP, the last entry's stop is updated(replaced).
 */
function timestampReducer(state = Immutable.List(), action)
{
    let timestamp = action.timestamp || new Date();
    let lastEntry;
    switch (action.type) {

        case 'REGISTER_START':

            lastEntry = state.last();
            // If last entry does not have a stop, make this a stop.
            // and create a new entry.
            // @todo - Handle case when user closed the browser
            if (lastEntry && !lastEntry.stop) {
                lastEntry.stop = timestamp;
                lastEntry.elapsedSeconds = deltaSeconds(lastEntry.start, lastEntry.stop);
                state = state.set(state.size - 1, lastEntry);
            }
            let entry = {
                start: timestamp
            };
            state = state.push(entry);
            console.log('REGISTER_START ts:' + JSON.stringify(state.toJS()));
            return state;

        case 'REGISTER_STOP':
            lastEntry = state.last();
            if (lastEntry) {
                lastEntry.stop = timestamp;
                lastEntry.elapsedSeconds = deltaSeconds(lastEntry.start, lastEntry.stop);
                return state.set(state.size - 1, lastEntry);
            } else {
                let entry = {
                    start: timestamp,
                    stop: timestamp,
                    elapsedSeconds: 0
                };
                return state.push(entry);
            }

        case 'RESTORE_TIMESTAMPS':
            let timestamps = action.timestamps;
            state = Immutable.List(timestamps);
            console.log('RESTORE_TIMESTAMPS ts:' + JSON.stringify(state.toJS()));
            return state;

        default:
            return state;
    }
}

/**
 * Combined reducers
 */
const reducers = {
    components: componentReducer,
    evaluations: evaluationReducer,
    timestamps: timestampReducer
}

export default reducers;
