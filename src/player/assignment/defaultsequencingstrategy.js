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
 *  This file includes the definition of RandomVarSequencingStrategy class.
 *
 * @author Young Suk Ahn Park
 * @date 1/02/16
 */
var promiseutils = require('../../../libs/common/promiseutils');
import {dotAccess} from '../../../libs/common/utils';
import VariablesRandomizer from './variablesrandomizer.js';

 /**
  * @class RandomVarSequencingStrategy
  *
  * @module interactives/player/assignment
  *
  * @classdesc
  *  This sequencing strategy takes a content and generates N number of
  * intsances.
  *  The content should be a template content, i.e. it should have variable
  * declaration and the question prompts should be referencing them.
  *
  * MUST implement the following methods:
  * retrieveActivity(index) -> Promise.resolve(SequenceActivity)
  * retrieveNextActivity() -> Promise.resolve(SequenceActivity)
  */
export default class DefaultSequencingStrategy
{
    /**
     * @param {Object} config - the config
     */
    constructor(config)
    {
        /**
         * @type {string} the URL of the template content
         */
        this.assignmentProvider__ = config.assignmentProvider;

        /**
         * @typd {string} - Assignment ID
         */
        this.assignmentUuid_ = null;
    }

    /**
     * Starts a new assignment
     * @param {string} outsetNodeUuid - outsent content node
     * @return AssignmentDetails
     */
    startAssignment(outsetNodeUuid)
    {
        return this.assignmentProvider__.startAssignment(outsetNodeUuid)
        .then(function (assignmentDetails){
            this.assignmentUuid_ = assignmentDetails.uuid;
        }.bind(this));
    }

    /**
     * Resumes an existig assignment
     * @param {string} assignmentUuid - assignment id
     * @return AssignmentDetails
     */
    getAssignment(assignmentUuid)
    {
        return this.assignmentProvider__.getAssignment(assignmentUuid)
        .then(function (assignmentDetails){
            this.assignmentUuid_ = assignmentDetails.uuid;
        }.bind(this));
    }

    /**
     * Gets the activity in the sequence history
     * @return {player.ActivityDescriptor}
     */
    retrieveActivity(uuid)
    {
        return this.assignmentProvider__.fetchActivity(this.assignmentUuid_, uuid);
    }

    /**
     * Get next activity
     * @return {promise} - On success the next sequenceActivity (object containing associationId, item content)
     */
    retrieveNextActivity()
    {
        return this.assignmentProvider__.createNextActivity(this.assignmentUuid_);
    }

}
