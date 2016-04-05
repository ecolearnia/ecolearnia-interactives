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

var core = require('./bundle-core');
module.exports.PubSub = core.PubSub;
module.exports.Container = core.Container;

var player = require('./bundle-player');
/**
 * Players and their auxiliaries:
 * These can be bundled in different file
 */
module.exports.ItemPlayer = player.ItemPlayer;
module.exports.AssignmentPlayer = player.AssignmentPlayer;

/**
 * Modules for fully local operation
 * @todo - Externalized into a different js bundle so it can be opted out
 */
module.exports.LocalNodeSysRec = player.LocalNodeSysRec
module.exports.LocalNodeProvider = player.LocalNodeProvider
module.exports.LocalRandomVarSequencingStrategy = player.LocalRandomVarSequencingStrategy;
module.exports.VariablesRandomizer = player.VariablesRandomizer;
module.exports.LocalEvaluator = player.LocalEvaluator;

//Modules
module.exports.modules = {};

var moduleCommon = require('./components/module-common');
module.exports.Breadcrumbs = moduleCommon.Breadcrumbs;
module.exports.TemplateContainer = moduleCommon.TemplateContainer;
module.exports.modules.common = moduleCommon.manifest;

var moduleAssessmentCommon = require('./components/module-assessment-common');
module.exports.ActionBar = moduleAssessmentCommon.ActionBar;
module.exports.Feedback = moduleAssessmentCommon.Feedback;
module.exports.SelectQuestion = moduleAssessmentCommon.SelectQuestion;
module.exports.TextFieldQuestion = moduleAssessmentCommon.TextFieldQuestion;
module.exports.modules.assessmentCommon = moduleAssessmentCommon.manifest;

var moduleMathElem = require('./components/module-math-elem');
module.exports.NineNumbersQuestion = moduleMathElem.NineNumbersQuestion;
module.exports.modules.mathElem = moduleMathElem.manifest;
