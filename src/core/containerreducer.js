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
 * containerReducer
 *
 * @module interactives/core
 *
 * @desc
 *  Redux item reducer function
 *
 */
function containerReducer(state = Immutable.List(), action) {
    switch (action.type) {
        case 'ITEM_APPEND_MESSAGE':
            return state.push(action.message);
        default:
            return state;
    }
}
