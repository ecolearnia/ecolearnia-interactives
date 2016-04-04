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
 *  This file includes references to all interactive components and core dependencies.
 *
 * @author Young Suk Ahn Park
 * @date 5/14/15
 */

/**
 * Interactive Components:
 * The interactive components must be exported, otherwise the CoreContext will
 * not be able to instantiate.
 */
var NineNumbersQuestion = require('./math-elem/ninenumbersquestion.jsx').default;
module.exports.NineNumbersQuestion = NineNumbersQuestion;
