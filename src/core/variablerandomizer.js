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
    apply(content) {
        let contentClone = JSON.parse(JSON.stringify(content));

        for(let varName in contentClone.variableDeclarations)
        {
            vars[varName] = ;
        }

        return contentClone;
    }
}
