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
function componentReducer(state = Immutable.Map(), action) {
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
function evaluationReducer(state = Immutable.List(), action) {
    switch (action.type) {
        case 'ITEM_APPEND_EVALDETAILS':
            return state.push(action.evalDetails);
        default:
            return state;
    }
}

/**
 * Combined reducers
 */
const reducers = {
    components: componentReducer,
    evaluations: evaluationReducer
}

export default reducers;
