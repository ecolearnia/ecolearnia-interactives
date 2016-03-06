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
 *   }
 * }} player.FieldCollection
 */
player.FieldCollection;


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
 *   <field0>: {
 *     "score": (number),
 *     "feedback": (string),
 *   },
 *   <field1>: {
 *     "score": (number),
 *     "feedback": (string),
 *   },
 * }} player.EvalResult
 */
player.EvalResult;


/**
 * @typedef {{
 *    submission: {
 *      timestamp: (Date),
 *      "fields": (player.FieldCollection)
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
 *      "field1": {
 *        "score": 1,
 *        "feedback": "You are correct!",
 *      }
 *    }
 *  }
 */
namespace.EvalDetails;


/**
 * @typedef {React} player.Component
 */
player.Component;


/**
 * @typedef {Content} player.ContentDefinition
 * This is the definition of the content that complies to the specification
 */
player.ContentDefinition;


 /**
  * @typedef {{
  *   id: (string), // the node id (uuid)
  *   userId: (string),
  *   playerName: (string), // The name of the (item) player
  * }} player.NodeDescriptor
  */
player.NodeDescriptor;


/**
 * Superset of NodeDescriptor
 * @typedef {{
 * player.NodeDescriptor extend {
 *   content: (player.ContentDefinition),
 *   itemState: (player.ItemState),
 * }} player.NodeDetails
 */
player.NodeDetails;
