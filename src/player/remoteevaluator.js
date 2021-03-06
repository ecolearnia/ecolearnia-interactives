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
 * @date 1/02/16
 */

//var logger = require('../../libs/common/logger');
var logger = require('../../libs/common/logger');

/**
 * @class RemoteEvaluator
 *
 * @module interactives/player
 *
 * @classdesc
 *  An object of this class is handles the submission data by calling a remote
 * service for evaluation.
 *
 */
export default class RemoteEvaluator
{
    constructor(config)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('RemoteEvaluator');

        /**
         * @type {AssignmentProvider}
         * @private
         */
        this.assignmentProvider_ = config.assignmentProvider;

    }

    /**
     * Evaluate the student submission against the provided rule
     * For php implementation, use
     * http://symfony.com/doc/current/components/expression_language/syntax.html
     *
     * @param {string} associationId  -  The instance ID that the item is associated to
     * @param {Array.<{fieldId, answered}>} answer - student submission
     *
     * @returns {Promise}
     *      On Succss: Returns outcome (Object) in key-value pairs
     */
    evaluate(assignmentUuid, activityUuid, submissionDetails)
    {
        return this.evaluateRemote_(assignmentUuid, activityUuid, submissionDetails);
    }

    /**
     * Evaluate the student submission against the provided rule
     * For php implementation, use
     * http://symfony.com/doc/current/components/expression_language/syntax.html
     *
     * @param {string} assignmentUuid
     * @param {string} activityUuid
     * @param {Array.<{fieldId, answered}>} answer - student submission
     *
     * @returns {Promise}
     *      On Succss: Returns outcome (Object) in key-value pairs
     */
    evaluateRemote_(assignmentUuid, activityUuid, submissionDetails)
    {
        return this.assignmentProvider_.evalActivity(assignmentUuid, activityUuid, submissionDetails);
    }
}
