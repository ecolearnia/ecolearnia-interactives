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

        this.itemEvalBriefs_ = [];
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
            let activityId = activityDetails.uuid ? activityDetails.uuid : this.getNextId();
            activityDetails.uuid = activityId;
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

            this.activities_[id].item_state = cloneObject(itemState);

            // Add evalResult records
            // This case comes from evaluator (e.g. localevaluator.js)
            if (itemState['@type'] === 'evaluation') {
                if (!('item_evalDetailsList' in this.activities_[id])) {
                    this.activities_[id].item_evalDetailsList = [];
                }
                this.activities_[id].item_evalDetailsList.push(cloneObject(itemState.data));

                this.activities_[id].item_state.data = { fields: this.activities_[id].item_state.data.submission.fields};

            }

            if (timestamps) {
                this.activities_[id].item_timestamps = cloneObject(timestamps);
            }

            return resolve();
        }.bind(this));
    }

    getNextId()
    {
        //(Math.floor((Math.random() * 1000) + 1)).toString()
        return 'LOCAL-' + (this.currId_++).toString();
    }


    updateEvalBriefs(assignmentUuid, activityUuid, evalDetails)
    {
        var evalBrief = {};
        evalBrief.attemptNum = evalDetails.evalResult.attemptNum;
        evalBrief.secondsSpent = evalDetails.submission.secondsSpent;
        evalBrief.aggregateResult = evalDetails.evalResult.aggregate;

        var found = false;
        for(var i=0; i < this.itemEvalBriefs_.length; i++ ) {
            if (this.itemEvalBriefs_[i].activityId == activityUuid) {
                this.itemEvalBriefs_[i] = evalBrief;
                found = true;
            }
        }
        if (!found) {
            this.itemEvalBriefs_.push(evalBrief);
        }

    }

    /**
     * Builds a stats object
     * @param {Array.<>}itemEvalBriefs
     */
    buildStats()
    {
        let stats = {
            score: 0,
            corrects: 0,
            incorrects: 0,
            semicorrects: 0
        };

        for (let i=0; i < this.itemEvalBriefs_.length; i++) {
            if (this.itemEvalBriefs_[i].aggregateResult) {
                let itemEvalBrief = this.itemEvalBriefs_[i];
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

}
