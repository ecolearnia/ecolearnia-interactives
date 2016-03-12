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
 *  This file includes the definition of reducers for assignment.
 *
 * @author Young Suk Ahn Park
 * @date 3/09/2016
 */

import _ from 'lodash';
import Immutable from 'immutable';


/**
 * componentReducer
 *
 * @module interactives/player/item
 *
 * @desc
 *  Redux score reducer function for assignment.
 *  This reducer keeps the score state.
 *
 */
function statsReducer(state = Immutable.Map({}), action) {
    switch (action.type) {
        case 'STATS_ACCUMULATE':
            var score = state.get('score') || 0;
            if (action.score == 1) {
                // All Correct!
                //console.log('state (pre)=' + JSON.stringify(state));
                var corrects = state.get('corrects') || 0;
                return state.set('corrects', ++corrects).set('score', score + action.score);
            } else if (action.score == 0) {
                // All incorrect!
                var incorrects = state.get('incorrects') || 0;
                return state.set('incorrects', ++incorrects).set('score', score + action.score);
            } else {
                // Partial correct
                var semicorrects = state.get('semicorrects') || 0;
                return state.set('semicorrects', ++semicorrects).set('score', score + action.score);
            }

            //console.log('state (post)=' + JSON.stringify(newState));
            //return state.set('corrects', ++corrects);
        case 'STATS_INC_CORRECT':
            //console.log('state (pre)=' + JSON.stringify(state));
            var corrects = state.get('corrects') || 0;

            //console.log('state (post)=' + JSON.stringify(newState));
            return state.set('corrects', ++corrects);
        case 'STATS_INC_INCORRECT':
            //console.log('state (pre)=' + JSON.stringify(state));
            var incorrects = state.get('incorrects') || 0;

            //console.log('state (post)=' + JSON.stringify(newState));
            return state.set('incorrects', ++incorrects);
        default:
            return state;
    }
}


/**
 * Combined reducers
 */
const reducers = {
    stats: statsReducer
}

export default reducers;
