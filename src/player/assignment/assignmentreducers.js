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

import Immutable from 'immutable';


/**
 * componentReducer
 * @deprecated
 *
 * @module interactives/player/item
 *
 * @desc
 *  Redux score reducer function for assignment.
 *  This reducer keeps the score state.
 *
function statsReducer(state = Immutable.Map({}), action)
{
    switch (action.type) {
        case 'STATS_ACCUMULATE':
            var score = state.get('score') || 0;
            score += action.aggregateResult.score;
            if (action.aggregateResult.pass) {
                // All Correct!
                //console.log('state (pre)=' + JSON.stringify(state));
                var corrects = state.get('corrects') || 0;
                return state.set('corrects', ++corrects).set('score', score);
            } else {
                if (action.aggregateResult.score == 0) {
                   // All incorrect!
                   var incorrects = state.get('incorrects') || 0;
                   return state.set('incorrects', ++incorrects).set('score', score);
                } else {
                    // Partial correct
                    var semicorrects = state.get('semicorrects') || 0;
                    return state.set('semicorrects', ++semicorrects).set('score', score);
                }
            }

        default:
            return state;
    }
}
*/

const initialState = Immutable.Map({
    stats: {
        score: 0,
        corrects: 0,
        incorrects: 0,
        semicorrects: 0
    },
    itemEvalBriefs: Immutable.OrderedMap({})
});


function reportReducer(state = initialState, action)
{
    switch (action.type) {
        case 'ADD_EVAL_BRIEF':

            let itemEvalBriefs = state.get('itemEvalBriefs') || Immutable.OrderedMap({});
            state = state.set('itemEvalBriefs', itemEvalBriefs.set(action.activityId,
                {
                    activityId: action.activityId,
                    attemptNum: action.attemptNum,
                    secondsSpent: action.secondsSpent,
                    aggregateResult: action.aggregateResult
                }
            ));

            return state.set('stats', buildStats_(state.get('itemEvalBriefs').toArray()));

        default:
            return state;
    }
}

/**
 * Builds a stats object
 * @param {Array.<>}itemEvalBriefs
 */
function buildStats_(itemEvalBriefs)
{
    let stats = {
        score: 0,
        corrects: 0,
        incorrects: 0,
        semicorrects: 0
    };
    for (let i=0; i < itemEvalBriefs.length; i++) {
        if (itemEvalBriefs[i].aggregateResult) {
            let itemEvalBrief = itemEvalBriefs[i];
            stats.score += itemEvalBrief.aggregateResult.score;
            if (itemEvalBrief.aggregateResult.pass) {
                stats.corrects++;
            } else {
                if (itemEvalBrief.aggregateResult.score == 0) {
                    stats.incorrects++;
                } else {
                    // Partial correct
                    stats.semicorrects++;
                }
            }
        }
    }
    return stats;
}

/**
 * Combined reducers
 */
const reducers = {
    report: reportReducer
    //itemEvalBriefs: itemEvalBriefReducer
};

export default reducers;
