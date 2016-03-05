/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

var _ = require('lodash');
var promiseutils = require('../../libs/common/promiseutils');

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of EvalRegex class.
 *
 * @author Young Suk Ahn Park
 * @date 6/05/15
 */

/**
 * @class EvalRegex
 *
 * @module interactives/evaluation
 *
 * @classdesc
 *  Engine that evaluates all of the the submission (input) matches the correctAnswer.
 *
 */
export class MultiMatch {

    constructor()
    {
        
    }

    /**
     *
     * @param params  - Evaluation rule param
     * @param {Object{key, value}} input
     *      where input.value is an array of strings 
     *
     * @returns {Promise(boolean)}
     */
    evaluate(params, input)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (!input ) {
                resolve(false);
            }

            // @todo - option to check keys instead of values
            // LOGIC TEST PENDING!!
            var values;
            if (!_.isArray(input)){
                values = [input.value];
            } else {
                values = input.map(function(element) {
                    return element.value;
                });
            }

            // @todo - match all, match subset
            var result = values.every(function(element, index) {
                var hasMatch = (params.matches.indexOf(element) > -1);
                return hasMatch;
            });
            resolve(result);
        }.bind(this));

        return promise;
    }
}

MultiMatch.prototype.name = 'multimatch';