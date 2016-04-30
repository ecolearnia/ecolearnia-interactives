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
export default class LocalRandomVarSequencingStrategy
{
    /**
     * @param {Object} config - the config
     */
    constructor(config)
    {
        /**
         * @type {string} the URL of the template content
         */
        this.resourceUrl_;

        /**
         * template content
         */
        this.templateContent_;

        // Assign values if provided
        if (config) {
            this.resourceUrl_ = config.resourceUrl;
            this.templateContent_ = config.templateContent;
        }

        /**
         * Array of activity descriptors
         * @type Array<player.ActivityDescriptors>
         */
        this.activityDescriptors_ = [];

        /**
         * The local system of records.
         * This is used to add content
         * @type {LocalActivitySysRec}
         */
        this.sysRecords_ = config.sysRecords;

        /**
         * Index of the current activity;
         */
        this.cursor_ = 0;

        /**
         * @todo - Verify if this is only applicable for local version
         */
        this.assignmentContext_ = {};
    }

    /**
     * Starts a new assignment
     * @param {string} outsetNodeUuid - outsent content node
     * @return AssignmentDetails
     */
    startAssignment(outsetNodeUuid)
    {
        // nothing to do for local
    }

    /**
     * Resumes an existig assignment
     * @param {string} assignmentUuid - assignment id
     * @return AssignmentDetails
     */
    resumeAssignment(assignmentUuid)
    {
        // nothing to do for local
    }

    /**
     * NO USED...
     * Set the assignment context
     * The assignment context include:
     * assemblySettings: {
     *     numItemInstances: number of questions to instantiate
     *   }
     * currentItem: associationId of the current (last) item touched.
     */
    setAssignmentContext(assignmentContext)
    {
        this.assignmentContext_ = assignmentContext;
        if (!this.assignmentContext_ || !this.assignmentContext_.assemblySettings)
        {
            throw new Error('Missing property assignmentContext.assemblySettings');
        }
        if (!this.assignmentContext_.assemblySettings.numItemInstances)
        {
            this.assignmentContext_.assemblySettings.numItemInstances = 10;
        }
    }

    /**
     * Gets the activity in the sequence history
     * @return {player.ActivityDescriptor}
     */
    retrieveActivityByIndex(index)
    {
        if (index < this.activityDescriptors_.length()) {
            return Promise.resolve(this.activityDescriptors_[index]);
        } else {
            return Promise.reject('Index out of bounds');
        }
    }

    /**
     * Gets the activity in the sequence history
     * @return {player.ActivityDescriptor}
     */
    retrieveActivity(uuid)
    {
        return this.sysRecords_.get(uuid);
    }

    /**
     * Get next activity
     * @param {player.assignent.AssignmentContext} the assignment context
     * @return {promise} - On success the next sequenceActivity (object containing associationId, item content)
     */
    retrieveNextActivity(assignmentContext)
    {
        let self = this;
        let numItemInstances = dotAccess(assignmentContext, 'assemblySettings.numItemInstances');
        numItemInstances = numItemInstances || 5;
        if (self.activityDescriptors_.length >= numItemInstances)
        {
            // Reached end of assignment item.
            return Promise.resolve(null);
        }

        var assignmentStats = this.sysRecords_.buildStats();

        return self.getTemplateContent_()
        .then(function(content){

            // The following is supposed to happen in the server side:
            var randomizer = new VariablesRandomizer();
            let newActivityDetails = {
                // Create a random number for the associationId
                userId: 'test-user',
                content: randomizer.apply(content, assignmentContext)
            };
            return self.sysRecords_.add(newActivityDetails)
            .then(function(activityId) {
                let newActivityDescriptor = {
                    uuid: activityId,
                    playerName: 'ItemPlayer',
                    userId: newActivityDetails.userId
                };
                self.activityDescriptors_.push(newActivityDescriptor);

                return newActivityDescriptor;
            });
        });
    }

    /**
     * Gets the template content
     */
    getTemplateContent_()
    {
        let self = this;
        return promiseutils.createPromise( function(resolve, reject) {

            if (self.templateContent_) {
                return resolve(self.templateContent_);
            }

            if (!self.resourceUrl_) {
                return reject('resourceUrl not defined');
            }
            $.getJSON(self.resourceUrl_, function( data ) {
                if (data && data.variableDeclarations) {
                    self.templateContent_ = data;
                } else {
                    return reject('There is no variable in the content definition');
                }
                return resolve(self.templateContent_);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                return reject(textStatus);
            });

        }.bind(this));
    }
}
