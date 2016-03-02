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
 *  This file includes the definition of ItemPlayer class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var _ = require('lodash');

import utils from '../../libs/common/utils';
import logger from '../../libs/common/logger';

/**
 * @class VariableRandomizer
 *
 * @module interactives/core
 *
 * @classdesc
 *  VariableRandomizer produces a new insance of a content with variable randomized
 *
 * @constructor
 *
 * @param {object} config
 *
 */
export default class VariableRandomizer
{
    constructor(config)
    {
    }

    /**
     * Returns a new object with intantiated variables
     */
    apply(content, params) {
        let multiplier = (params && params.multiplier) ? params.multiplier : 1;
        let contentClone = JSON.parse(JSON.stringify(content));
        let vars = contentClone.variableDeclarations;
        for(let varName in vars)
        {
            if (vars[varName].baseType.toLowerCase() == 'number') {
                let minVal = (vars[varName].minVal) ? vars[varName].minVal : 0;
                let maxVal = (vars[varName].maxVal) ? vars[varName].maxVal : 100;
                vars[varName].value = Math.floor(Math.random() * maxVal * multiplier) + minVal  ;
            } else if (vars[varName].baseType.toLowerCase() == 'boolean') {
                vars[varName].value = Math.floor(Math.random() * 2) == 1 ? true : false ;
            }
        }

        return contentClone;
    }
}
