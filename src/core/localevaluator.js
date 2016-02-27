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
import WhenHandler from '../evaluation/whenhandler';


/**
 * @typedef {{
 *      timeSpent: (number),
 *      fields: (Array<core.AnswerField>)
 * }} core.AnswerSubmission
 *
 */


/**
 * @class Evaluator
 *
 * @module interactives/core
 *
 * @classdesc
 *  An object of this class is handles the submission data by evaluating data
 * locally with the registered handlers.
 *
 */
export default class LocalEvaluator
{
    constructor(settings)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('Evaluator');

        //this.pubsub = settings.pubsub;

        /**
         * Evaluation handlers
         * @type {{}}
         * @private
         */
        this.handlers_ = {};

        // Register the default handler
        this.registerHandler(new WhenHandler());

        /**
         * evalRules per item
         * @type {Object}
         * @private
         */
        this.rules_ = {};

        /**
         * Variables
         */
        this.variables_ = {}

        // Subscribe to the submission action event
        if (this.pubsub) {
            this.pubsub.subscribe(Events.ANSWER_EVALUATE,
                this.handleEvaluateEvent_.bind(this)
            );
        }
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
     */
    registerItemPlayer(itemPlayer)
    {
        var associationId = itemPlayer.getAssociationId();
        // The response processing rule
        var rule = itemPlayer.getContent().responseProcessing;
        this.rules_[associationId] = rule;
        this.variables_ = itemPlayer.getContent().variableDeclarations || {};
    }

    /**
     * Retrieves a rule
     * @param associationId
     * @returns {Promise}
     */
    retrieveRule(associationId)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (associationId in this.rules_)
            {
                resolve(this.rules_[associationId]);
            } else {
                reject({error:'Eval rule for item ' + associationId + ' not found.'});
            }

        }.bind(this));

        return promise;
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
        var rule = this.rules_[associationId];

        let combinedSubmissionData  = this.combineSubmissionData_(submissionData);

        //console.log(combinedSubmissionData);

        return this.evaluateLocal_(rule, combinedSubmissionData);
    }

    /**
     * Combine submission data with:
     * 1. flattened nested values of itself
     * 2. variables from the content
     */
    combineSubmissionData_(submissionData)
    {
        let combinedSubmissionData = {};

        // add values from flattened nested objects,
        // eg. field1: {key, value} into field1_key and field1_value
        _.assign(combinedSubmissionData, submissionData, dehydrate(submissionData, null, '_'));

        // Add variables with 'var_' prefix
        let vars = {};
        for(let varName in this.variables_)
        {
            vars['var_' + varName] = this.variables_[varName].value;
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
        var promise = promiseutils.createPromise( function(resolve, reject) {
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

        return promise;
    }


    /**
     * PubSub Event subscription handler
     *
     * @param message
     * @private
     */
    handleEvaluateEvent_(message)
    {
        var associationId = message.source.associationId;
        this.evaluate(message.payload)
            .then( function(result){
                this.pubsub.publish(
                    Events.ANSWER_EVALUATED,
                    associationId,
                    'evaluator',
                    'evaluation',
                    /** @type core.AnswerSubmission */ (result)
                );
                this.logger_.info({associationId: associationId}, 'Evaluation:published');
            }.bind(this))
            .catch( function (error) {
                this.logger_.info({associationId: associationId, error: error}, 'Evaluation:error');
            }.bind(this));
    }
}
