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
 *  This file includes the definition of LocalNodeProvider class.
 *
 * @author Young Suk Ahn Park
 * @date 3/04/2016
 */

 /**
  * @class RemoteNodeProvider
  *
  * @module interactives/player/item
  *
  * @classdesc
  *  LocalNodeProvider provides interface for CRUD operation of the Node
  *
  */
 export default class RemoteNodeProvider
 {
     /**
      * @param {object} config
      */
     constructor(config)
     {
         /**
          * The local system of records.
          * This is used to add content
          * @type {LocalNodeSysRec}
          */
         this.baseUrl = config.baseUrl_;
     }

     /**
      * Fetches a Node
      * @param {string} id  - the node id to fetch
      * @return {Promise.resolve({player.NodeDetails})} On success resolves
      *         node details
      */
     fetch(id)
     {
         throw new Error("NO IMPLEMENT");
         // @todo - AJAX call
     }

     /**
      * Saves an node item's state
      * @return {Promise.resolve({string})} On success resolves state id (uuid)
      */
     saveState(id, state)
     {
         throw new Error("NO IMPLEMENT");
         // @todo - AJAX call
     }


 }
