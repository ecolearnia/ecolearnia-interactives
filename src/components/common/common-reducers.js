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
 function breadcrumbsReducer(state = Immutable.List(), action)
 {
     switch (action.type) {
         case 'COMMON_SET_BREADCRUMBS':
             let newState = Immutable.List(action.items);
             return newState;
         default:
             return state;
     }
 }

/*
 * Combined reducers
 */
const reducers = {
    breadcrumbs: breadcrumbsReducer
}

export default reducers;
