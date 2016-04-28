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
 *  This file includes the definition of SubmissionHandler class.
 *
 * @author Young Suk Ahn Park
 * @date 3/03/16
 */

var promiseutils = require('../../libs/common/promiseutils');

// Quick JSON clone function
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

 /**
  * @class LocalActivitySysRec
  *
  * @module interactives/player/assignment
  *
  * @classdesc
  *  Local Activity System of Records.
  *
  */
export default class LocalActivitySysRec
{
    constructor(config)
    {
        this.currId_ = 0;
        this.activities_ = {};
    }

    /**
     * Return the number of elements in the system of records
     * @return {number} number of elements
     */
    size()
    {
        return this.activities_.length;
    }

    /**
     * Adds a new activity
     * @param {player.ActivityDetails} activityDetails
     * @return Promise.resolve({string}) On success resolves activityId
     */
    add(activityDetails)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            let activityId = activityDetails.id ? activityDetails.id : this.getNextId();
            activityDetails.id = activityId;
            this.activities_[activityId] = cloneObject(activityDetails);

            return resolve(activityId);
        }.bind(this));
    }

    /**
     * Retrieve Activity
     * @return Promise.resolve({player.ActivityDetails}) On success resolves the
     *         matching activity
     */
    get(id)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (!(id in this.activities_))
            {
                return reject('Unexistent ID');
            }
            let match = this.activities_[id];
            return resolve(match);
        }.bind(this));

        return promise;
    }

    /**
     * Saves an activity item's state
     * @param {string} id  - the activityId
     * @param {player.ItemState}  itemState - the item state
     * @param {Array.<player.ActivityTimestamp>!} timestamps - (optional) Array of timestamps
     * @return Promise.resolve({string}) On success resolves state id (uuid)
     */
    saveState(id, itemState, timestamps)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            if (!this.activities_[id]) {
                return reject('Unexistent ID');
            }
            // @todo - use array instead, and resolve a uuid
            this.activities_[id].itemState = cloneObject(itemState);

            // Add evalResult records
            // This case comes from evaluator (e.g. localevaluator.js)
            if (itemState['@type'] === 'evaluation') {
                if (!('evalDetails' in this.activities_[id])) {
                    this.activities_[id].evalDetails = [];
                }
                this.activities_[id].evalDetails.push(cloneObject(itemState));
            }

            if (timestamps) {
                this.activities_[id].timestamps = cloneObject(timestamps);
            }

            return resolve();
        }.bind(this));
    }

    getNextId()
    {
        //(Math.floor((Math.random() * 1000) + 1)).toString()
        return 'LOCAL-' + (this.currId_++).toString();
    }

}
