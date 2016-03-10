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

var PubSub = require('../libs/common/pubsub').default;
module.exports.PubSub = PubSub;

/**
 * Interactive Components:
 * The interactive components must be exported, otherwise the CoreContext will
 * not be able to instantiate.
 */
var ActionBar = require('./components/actionbar.jsx').ActionBarComponent;
var Feedback = require('./components/feedback.jsx').FeedbackComponent;
var SelectQuestion = require('./components/questions/selectquestion.jsx').SelectQuestionComponent;
var TextFieldQuestion = require('./components/questions/textfieldquestion.jsx').TextFieldQuestionComponent;
var NineNumbersQuestion = require('./components/questions/ninenumbersquestion.jsx').NineNumbersQuestionComponent;
var TemplateContainer = require('./components/templatecontainer').TemplateContainerComponent;
module.exports.ActionBar = ActionBar;
module.exports.Feedback = Feedback;
module.exports.SelectQuestion = SelectQuestion;
module.exports.TextFieldQuestion = TextFieldQuestion;
module.exports.TemplateContainer = TemplateContainer;
module.exports.NineNumbersQuestion = NineNumbersQuestion;

/**
 * Players and their auxiliaries:
 * These can be bundled in different file
 */
var ItemPlayer = require('./player/item/itemplayer').default;
var AssignmentPlayer = require('./player/assignment/assignmentplayer').default;
module.exports.ItemPlayer = ItemPlayer;
module.exports.AssignmentPlayer = AssignmentPlayer;

/**
 * Modules for fully local operation
 * @todo - Externalized into a different js bundle so it can be opted out
 */
var LocalNodeSysRec = require('./player/localnodesysrec').default;
var LocalNodeProvider = require('./player/item/localnodeprovider').default;
var LocalRandomVarSequencingStrategy = require('./player/assignment/localrandomvarsequencingstrategy').default;
var VariableRandomizer = require('./player/assignment/variablerandomizer').default;
var LocalEvaluator = require('./player/localevaluator').default;
module.exports.LocalNodeSysRec = LocalNodeSysRec
module.exports.LocalNodeProvider = LocalNodeProvider
module.exports.LocalRandomVarSequencingStrategy = LocalRandomVarSequencingStrategy;
module.exports.VariableRandomizer = VariableRandomizer;
module.exports.LocalEvaluator = LocalEvaluator;
