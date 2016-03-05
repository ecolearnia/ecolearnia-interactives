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
 *  This file includes the definition of SubmissionHandler class.
 *
 * @author Young Suk Ahn Park
 * @date 3/03/16
 */

var promiseutils = require('../../../libs/common/promiseutils');


var namespace = {};
 /**
  * @typedef {{
  *   nodeId: (string), // URN
  *   player: (string),
  *   content: (ItemDescription),
  * }} NodeDetails
  */
namespace.NodeDetails;


 /**
  * @class LocalNodeSysRec
  *
  * @module interactives/player/assignment
  *
  * @classdesc
  *  Local SequenceNode System of Records.
  *
  */
 export default class LocalNodeSysRec
 {
    constructor(settings)
    {
        this.nodes_ = {};
    }

    /**
     * Adds a new node
     * @return Promise.resolve({string}) On success resolves nodeId
     */
    add(content)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            let newId = (Math.floor((Math.random() * 1000) + 1)).toString(),
            this.nodes_[newId] = content;
            resolve(newId);
        }.bind(this));
    }

    /**
     * Retrieve Node
     * @return Promise.resolve({NodeDetails}) On success resolves NodeDetails
     */
    get(id)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            resolve(this.nodes_[id]);
        }.bind(this));
    }

    /**
     * Updates an node item's state
     * @return Promise.resolve() On success resolves empty data
     */
    setState(id, state)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            resolve();
        }.bind(this));
    }

}
