/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */


/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes references to all interactive components and core dependencies.
 *
 * @author Young Suk Ahn Park
 * @date 5/14/15
 */

var PubSub = require('../libs/common/pubsub').PubSub;
//var itemcontext = require('./core/itemcontext');
var ItemPlayer = require('./core/itemplayer').default;

// Interactive Components.
var ActionBar = require('./components/actionbar.jsx').ActionBarComponent;
var Feedback = require('./components/feedback.jsx').FeedbackComponent;
var SelectQuestion = require('./components/questions/selectquestion.jsx').SelectQuestionComponent;
var TextFieldQuestion = require('./components/questions/textfieldquestion.jsx').TextFieldQuestionComponent;
var TemplateContainer = require('./components/templatecontainer').TemplateContainerComponent;

// @note - this can be externalized to another js bundle
var LocalEvaluator = require('./core/localevaluator').default;
var evaluation = require('./evaluation/evaluation');

var AssignmentPlayer = require('./core/assignmentplayer').default;
var RandomVarSequencingStrategy = require('./core/randomvarsequencingstrategy').default;
var VariableRandomizer = require('./core/variablerandomizer').default;

module.exports.AssignmentPlayer = AssignmentPlayer;
module.exports.RandomVarSequencingStrategy = RandomVarSequencingStrategy;
module.exports.VariableRandomizer = VariableRandomizer;

module.exports.LocalEvaluator = LocalEvaluator;
module.exports.evaluation = evaluation;

module.exports.PubSub = PubSub;
module.exports.ItemPlayer = ItemPlayer;

// The interactive components must be exported, otherwise the CoreContext will
// not be able to instantiate.
module.exports.ActionBar = ActionBar;
module.exports.Feedback = Feedback;
module.exports.SelectQuestion = SelectQuestion;
module.exports.TextFieldQuestion = TextFieldQuestion;
module.exports.TemplateContainer = TemplateContainer;
