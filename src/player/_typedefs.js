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
 * @todo - Need update
 * @typedef {{
 *      timeSpent: (number),
 *      fields: (Array<core.AnswerField>)
 * }} player.AnswerSubmission
 */
player.AnswerSubmission;

/**
 * @typedef {React} player.Component
 */
player.Component;

/**
 * @typedef {Content} player.ContentDefinition
 */
player.ContentDefinition;


 /**
  * @typedef {{
  *   id: (string), // the node id (uuid)
  *   userId: (string),
  *   playerName: (string), // The name of the (item) player
  * }} NodeDescriptor
  */
player.NodeDescriptor;

/**
 * Superset of NodeDescriptor
 * @typedef {
 * player.NodeDescriptor extend {
 *   content: (ItemDescription),
 *   itemState: (ItemDescription),
 * }} NodeDetails
 */
player.NodeDetails;
