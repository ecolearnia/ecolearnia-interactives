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
  *  This file includes the type definitions for clarity.
  *
  * @author Young Suk Ahn Park
  * @date 3/04/2016
  */


// Declaration of the namespace
var player = {};


/**
 * @typedef {{
 *   <fieldId>: {
 *     "key": (string | number),
 *     "value": (string | number | boolean | Array),
 *   }...
 * }} player.FieldCollection
 */
player.FieldCollection;

/**
 * @typedef {{
 *   timestamp: (datetime),
 *   fields: (player.FieldCollection)
 * }} player.FieldCollection
 */
player.SubmissionDetails;
/**
 * @typedef {{
 *   <componentId0>: (FieldCollection),
 *   <componentId1>: (FieldCollection), ...
 * }} ItemState
 * NOTE: The itemState is no longer grouped into componentId.
 *       Only one sigle "fields" property is used for all components.
 */
player.ItemState;


/**
 * @typedef {{
 *   pass: (boolean),
 *   score: (number),
 *   feedback: (string)
 * }} player.FieldEvalResult
 */
player.FieldEvalResult;

/**
 * @typedef {{
 *   attemptNum: (number),
 *   attemptsLeft: (number),
 *   pass: (boolean),
 *   aggregate: (player.FieldEvalResult),
 *   fields: {
 *     <field0>: (player.FieldEvalResult),
 *     <field1>: (player.FieldEvalResult)
 *   }
 * }} player.EvalResult
 */
player.EvalResult;


/**
 * @typedef {{
 *    submission: {
 *      timestamp: (Date),
 *      secondsSpent: (number),
 *      fields: (player.FieldCollection)
 *    },
 *    evalResult: (player.EvalResult)
 *  }} EvalDetails
 *
 *  Example:
 *    "submission": {
 *      "timestamp": "20160213T13:25:00.23",
 *      "fields": {
 *        "field1": {
 *          "key": "ans1",
 *          "value": "Earth",
 *        }
 *      }
 *    },
 *    "evalResult": {
 *      "attemptNum": 1,
 *      "attemptsLeft": 1,
 *      "aggregate": {
 *        "pass": true,
 *        "score": 1,
 *        "feedback": "Optional!"
        }
 *      "fields": {
 *        "field1": {
 *          "pass": true,
 *          "score": 1,
 *          "feedback": "You are correct!"
 *        }
 *      }
 *    }
 *  }
 */
player.EvalDetails;


/**
 * @typedef {React} player.Component
 */
player.Component;


/**
 * This is the definition of the content that complies to the specification
 * @typedef {Content} player.ContentDefinition
 */
player.ContentDefinition;

/**
 * Node related structures:
 * A Node is an instantiation of a learning sequence activity.
 * When a student requests the next acivity, an item instance is created and
 * contextual information is associated with it including the user, policy,
 * item state, evaluation details, and timestamples.
 */

 /**
  * A Node Descriptor is a synopsys of a node that is used as identifier.
  * The AssignmentPlayer (AS) obtains this information when getting the next node.
  * The AP passes it to the ItemPlayer (IP) to fetch the full data knwon as
  * NodeDetails.
  *
  * @typedef {{
  *   id: (string), // the node id (uuid)
  *   userId: (string),
  *   playerName: (string), // The name of the (item) player
  *   policy: (Object), // The policy
  * }} player.NodeDescriptor
  */
player.NodeDescriptor;


/**
 * Full Node data. Superset of NodeDescriptor.
 *
 * @typedef {{
 * player.NodeDescriptor extend {
 *   content: (player.ContentDefinition),
 *   itemState: (player.ItemState),
 *   evalDetails: (player.EvalDetails)
 * }} player.NodeDetails
 */
player.NodeDetails;
