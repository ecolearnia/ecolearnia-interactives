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
 * @date 2/17/16
 */

var _ = require('lodash');

//var logger = require('../../libs/common/logger');
import utils from '../../../libs/common/utils';
import math from 'mathjs';

/**
 * @class WhenHandler
 *
 * @module interactives/core
 *
 * @classdesc
 *   Instance of this class handles the "when" rule
 *
 */
export default class WhenHandler
{

    /**
     * Evaluate a 'when' rule statement
     *
     * @param {Object} statement  - The statement object
     * @param {object} answer  - The key value pair
     */
    eval(statement, answer)
    {
        var outcomes = {};

        for (var i=0; i < statement.length; i++) {
            var caseClause = statement[i];
            var caseExpr = null;
            if (_.isString(caseClause.case)) {
                caseExpr = caseClause.case.replace(/\$/g, '');
                //console.log('caseExpr=' + caseExpr);
                try {
                    var result = math.eval(caseExpr, answer)
                    if (result) {
                        //console.log('[' + caseExpr + '] condition met');
                        for(var thenItem in caseClause.then) {
                            outcomes[thenItem] = caseClause.then[thenItem];
                        }
                    } else {
                        //console.log('[' + caseExpr + '] condition not met');
                    }
                } catch (exception) {
                    if (utils.startsWith(exception.message, "Undefined symbol"))
                    {
                        // ignore, i.e. skip as this the symbol was not defined
                        // at the moment of submission
                    } else {
                        // re-throw
                        throw exception;ß
                    }
                }
            } // if (_.isString(case))
        }

        return utils.hydrate(outcomes);
    }
}

WhenHandler.prototype.name = 'when';
