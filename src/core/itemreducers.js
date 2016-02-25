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
 * @module interactives/core
 *
 * @desc
 *  Redux item reducer function for component.
 *  This reducer keeps the component state in the following structure:
 *  Immutable.Map.<{string} componentName, {object} state >
 *  Exampole:
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
            var currState = state.get(action.componentId) || {};
            console.log('currState (pre)=' + JSON.stringify(currState));
            _.assign(currState, action.state);
            console.log('currState (post)=' + JSON.stringify(currState));

            let newState = state.set(action.componentId, currState);
            //console.log('state (post)=' + JSON.stringify(newState));
            return newState;
        default:
            return state;
    }
}

/**
 * evalResultReducer
 *
 * @module interactives/core
 *
 * @desc
 *  Redux item reducer function for evaluations (aka response processing)
 *  resulting from submission.
 *  This reducer keeps the evaluation details in the following structure:
 *  Immutable.List.<{object} evalDetails> }.
 *  Exampole:
 *  [{
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
 *  }]
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
