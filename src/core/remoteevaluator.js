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

var _ = require('lodash');

//var logger = require('../../libs/common/logger');
var promiseutils = require('../../libs/common/promiseutils');

/**
 * @class RemoteEvaluator
 *
 * @module interactives/core
 *
 * @classdesc
 *  An object of this class is handles the submission data by calling a remote
 * service for evaluation.
 *
 */
export default class Removtevaluator
{
    constructor(settings)
    {
        /**
         * The logger
         */
        //this.logger_ = logger.getLogger('Evaluator');

        /**
         * Evaluation handlers
         * @type {{}}
         * @private
         */
        this.serviceUrl = settings.serviceUrl;

    }

    /**
     * Register rules per item
     * Applicable for in-memory evaluation (e.g. non remote)
     *
     * @param {ItemPlayer} itemPlayer - The id associated with item (one per itemPlayer)
     */
    registerItemPlayer(itemPlayer)
    {
        var associationId = itemPlayer.getAssociationId();
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
    evaluate(associationId, submissionData)
    {
        return this.evaluateRemote_(associationId, submissionData);
    }

    /**
     * Evaluate the student submission against the provided rule
     * For php implementation, use
     * http://symfony.com/doc/current/components/expression_language/syntax.html
     *
     * @param {Object} rule
     * @param {Array.<{fieldId, answered}>} answer - student submission
     *
     * @returns {Promise}
     *      On Succss: Returns outcome (Object) in key-value pairs
     */
    evaluateLocal_(associationId, submissionData)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            // @todo - implement

        }.bind(this));
    }
}
