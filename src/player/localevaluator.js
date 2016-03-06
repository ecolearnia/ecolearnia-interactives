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

var logger = require('../../libs/common/logger');
var promiseutils = require('../../libs/common/promiseutils');
import {dehydrate} from '../../libs/common/utils';
import WhenHandler from './evaluation/whenhandler';


/**
 * @class Evaluator
 *
 * @module interactives/player
 *
 * @classdesc
 *  An object of this class is handles the submission data by evaluating data
 * locally with the registered handlers.
 *
 */
export default class LocalEvaluator
{
    constructor(config)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('Evaluator');

        /**
         * Evaluation handlers
         * @type {{}}
         */
        this.sysRecords_ = config.sysRecords;

        /**
         * Evaluation handlers
         * @type {{}}
         */
        this.handlers_ = {};

        // Register the default handler
        this.registerHandler(new WhenHandler());

    }

    /**
     * Register an evaluator handler
     *
     * @param handler
     */
    registerHandler(handler)
    {
        this.handlers_[handler.name] = handler;
    }

    /**
     * Register rules per item
     * Applicable for in-memory evaluation (e.g. non remote)
     *
     * @param {ItemPlayer} itemPlayer - The id associated with item (one per itemPlayer)
     * @param {ItemPlayer} itemPlayer - The id associated with item (one per itemPlayer)
    registerContent(nodeId, content)
    {
        // The response processing rule
        this.rules_[nodeId] = content.responseProcessing;
        this.variables_[nodeId] = content.variableDeclarations || {};
    }
    */

    /**
     * Retrieves a rule
     * @param nodeId
     * @returns {Promise}
     */
    retrieveRule(nodeId)
    {
        return this.sysRecords_.get(nodeId)
        .then(function(nodeDetails){
            return (nodeDetails.content.responseProcessing);
            //resolve(this.rules_[nodeId]);
        });
    }

    /**
     * Evaluate the student submission against the provided rule
     * Upon successful evaluation process, save state to the system of records.
     * For php implementation, use
     * http://symfony.com/doc/current/components/expression_language/syntax.html
     *
     * @param {string} nodeId  -  The instance ID that the item is associated to
     * @param {Array.<{fieldId, answered}>} answer - student submission
     *
     * @returns {Promise}
     *      On Succss: Returns outcome (Object) in key-value pairs
     */
    evaluate(nodeId, submissionDetails)
    {
        return this.sysRecords_.get(nodeId)
        .then(function(nodeDetails) {
            let itemVars = nodeDetails.content.variableDeclarations || {};
            let combinedSubmissionData  = this.combineSubmissionData_(itemVars, submissionDetails.fields);
            //console.log(combinedSubmissionData);
            return this.evaluateLocal_(nodeDetails.content.responseProcessing, combinedSubmissionData);
        }.bind(this))
        .then(function(evalResult){

            let stateEntry = {
                "@type": "evaluation",
                data: {
                    submission: submissionDetails,
                    evalResult: evalResult
                }
            }
            this.sysRecords_.saveState(nodeId, stateEntry);
            return evalResult;
        }.bind(this));
    }

    /**
     * Combine submission data with:
     * 1. variables from the content. This is used for comparison.
     * 2. flattened nested values of itself
     * @param {Object} vars - The item's variableDeclarations
     * @param {Object} submissionData - the data that the student has submitted
     * @return Promise
     */
    combineSubmissionData_(variableDeclarations, submissionData)
    {
        let combinedSubmissionData = {};

        // add values from flattened nested objects,
        // eg. field1: {key, value} into field1_key and field1_value
        _.assign(combinedSubmissionData, submissionData, dehydrate(submissionData, null, '_'));

        // Add variables with 'var_' prefix
        let vars = {};
        for(let varName in variableDeclarations)
        {
            vars['var_' + varName] = variableDeclarations[varName].value;
        }
        _.assign(combinedSubmissionData, vars);
        return combinedSubmissionData;
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
    evaluateLocal_(rule, submissionData)
    {
        //return Promise.reject("Testing static reject");

        return promiseutils.createPromise( function(resolve, reject) {
            var outcomes = {};

            for (var statementKey in rule) {
                var statementHandler = this.handlers_[statementKey];

                try {
                    // using primivite for construct so it can break
                    if (statementHandler && rule[statementKey]) {
                        // Accumulate outcomes.
                        outcomes = _.assignIn(outcomes,
                            statementHandler.eval(rule[statementKey], submissionData));
                    }
                } catch (error) {
                    return reject(error);
                }
            }

            //console.log('outcomes=' + JSON.stringify(outcomes));
            resolve(outcomes);

        }.bind(this));

    }
}
