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
var LocalActivitySysRec = require('./player/localactivitysysrec').default;
var LocalActivityProvider = require('./player/item/localactivityprovider').default;
var LocalRandomVarSequencingStrategy = require('./player/assignment/localrandomvarsequencingstrategy').default;
var VariablesRandomizer = require('./player/assignment/variablesrandomizer').default;
var LocalEvaluator = require('./player/localevaluator').default;
module.exports.LocalActivitySysRec = LocalActivitySysRec;
module.exports.LocalActivityProvider = LocalActivityProvider;
module.exports.LocalRandomVarSequencingStrategy = LocalRandomVarSequencingStrategy;
module.exports.VariablesRandomizer = VariablesRandomizer;
module.exports.LocalEvaluator = LocalEvaluator;
