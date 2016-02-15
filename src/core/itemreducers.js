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

import Immutable from 'immutable';


/**
 * itemReducer
 *
 * @module interactives/core
 *
 * @desc
 *  Redux item reducer function
 *
 */
function componentReducer(state = Immutable.Map({}), action) {
    switch (action.type) {
        case 'ITEM_UPDATE_STATE':
            //console.log('state (pre)=' + JSON.stringify(state));
            let newState = state.set(action.componentId, action.state);
            //console.log('state (post)=' + JSON.stringify(newState));
            return newState;
        default:
            return state;
    }
}

/**
 * Reducer for item's evaluation results
 */
function evalResultReducer(state = Immutable.Map({}), action) {
    switch (action.type) {
        case 'ITEM_UPDATE_EVALRESULT':
            return state.set(action.componentId, action.evalResult);
        default:
            return state;
    }
}

const reducers = {
    components: componentReducer,
    evalResults: evalResultReducer
}

export default reducers;
