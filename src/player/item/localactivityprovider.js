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
 *  This file includes the definition of LocalActivityProvider class.
 *
 * @author Young Suk Ahn Park
 * @date 3/04/2016
 */

 // Quick JSON clone function
 function cloneObject(obj) {
     return JSON.parse(JSON.stringify(obj));
 }

 /**
  * @class LocalActivityProvider
  *
  * @module interactives/player/item
  *
  * @classdesc
  *  LocalActivityProvider provides interface for CRUD operation of the Activity
  *
  */
 export default class LocalActivityProvider
 {
     /**
      * @param {object} config
      */
     constructor(config)
     {
         /**
          * The local system of records.
          * This is used to add content
          * @type {LocalActivitySysRec}
          */
         this.sysRecords_ = config.sysRecords;
     }

     /**
      * Fetches an activity
      * @param {string} id  - the activity id to fetch
      * @return {Promise.resolve({player.ActivityDetails})} On success resolves
      *         activity details
      */
     fetch(id)
     {
         return this.sysRecords_.get(id);
     }

     /**
      * Saves an activity item's state
      * @param {string} id  - the activity Id
      * @param {player.ItemState | player.EvalDetails} state
      * @param {Array} timestamps - Array of timestamps
      * @return {Promise.resolve({string})} On success resolves state id (uuid)
      */
     saveState(id, state, timestamps)
     {
         let stateEntry = {
             '@type': 'interaction',
             data: cloneObject(state)
         };
         return this.sysRecords_.saveState(id, stateEntry, timestamps);
     }


 }
