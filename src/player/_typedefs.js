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
 *      "secondsSpent": (number),
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
 *
 * @typedef {{
 *   start: (ISODate),
 *   stop: (ISODate),
 *   elapsedSeconds: (number)
 * }} player.ActivityTimestamp
 */
player.ActivityTimestamp;

/**
 * Activity related structures:
 * An activity is an instantiation of a learning sequence activity.
 * When a student requests the next acivity, an item instance is created and
 * contextual information is associated with it including the user, policy,
 * item state, evaluation details, and timestamples.
 */

 /**
  * An Activity Descriptor is a synopsys of a activity that is used as identifier.
  * The AssignmentPlayer (AS) obtains this information when getting the next activity.
  * The AP passes it to the ItemPlayer (IP) to fetch the full data knwon as
  * ActivityDetails.
  *
  * @typedef {{
  *   assignmentUuid: (string), // the activity id (uuid)
  *   uuid: (string), // the activity id (uuid)
  *   userId: (!string),
  *   playerName: (string), // The name of the (item) player
  *   policy: (Object), // The policy
  * }} player.ActivityDescriptor
  */
player.ActivityDescriptor;


/**
 * Full Activity data. Superset of ActivityDescriptor.
 *
 * @typedef {{
 * player.ActivityDescriptor extend {
 *   content: (player.ContentDefinition),
 *   itemState: (player.FieldCollection),
 *   timestamps: (Array.<ActivityTimestamp>),
 *   evalDetails: (player.EvalDetails)
 * }} player.ActivityDetails
 */
player.ActivityDetails;
