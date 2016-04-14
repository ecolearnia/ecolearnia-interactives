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

import utils from '../../../libs/common/utils';
import logger from '../../../libs/common/logger';

/**
 * @class VariableRandomizer
 *
 * @module interactives/player/assignment
 *
 * @classdesc
 *  VariableRandomizer produces a new insance of a content with variable randomized
 *
 */
export default class VariablesRandomizer
{
    /**
     * @constructor
     *
     * @param {object} config
     *
     */
    constructor(config)
    {
    }

    /**
     * Returns a new object with intantiated variables
     * @param {player.ContentDefinition} content
     * @param {player.assingment.AssignmentContext} params
     */
    apply(content, params)
    {
        let multiplier = 1;
        let baseNum = 0;
        if (params && params.stats) {
            //multiplier = (params.stats.score) ? params.stats.score : 1;
            let corrects = (params.stats.corrects) ? params.stats.corrects : 0;
            let incorrects = (params.stats.incorrects) ? params.stats.incorrects : 0;
            baseNum = corrects - incorrects;
        }
        let contentClone = JSON.parse(JSON.stringify(content));
        let vars = contentClone.variableDeclarations;
        for(let varName in vars)
        {
            // recalc for each variables
            let tmpMultiplier = multiplier;
            let tmpBaseNum = baseNum;
            if (vars[varName].variability === 'strict') {
                tmpMultiplier = 1;
                tmpBaseNum = 0;
            }
            if (vars[varName].baseType.toLowerCase() == 'number') {
                let minVal = (vars[varName].minVal) ? vars[varName].minVal : 0;
                minVal += tmpBaseNum;
                let maxVal = (vars[varName].maxVal) ? vars[varName].maxVal : 100;
                maxVal += tmpBaseNum;
                vars[varName].value = Math.floor(Math.random() * maxVal * tmpMultiplier) + minVal  ;
            } else if (vars[varName].baseType.toLowerCase() == 'boolean') {
                vars[varName].value = Math.floor(Math.random() * 2) == 1 ? true : false ;
            }
        }

        return contentClone;
    }
}
