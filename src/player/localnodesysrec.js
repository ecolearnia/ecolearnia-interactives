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

var promiseutils = require('../../libs/common/promiseutils');

// Quick JSON clone function
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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
    constructor(config)
    {
        this.currId_ = 0;
        this.nodes_ = {};
    }

    /**
     * Return the number of elements in the system of records
     * @return {number} number of elements
     */
    size()
    {
        return this.nodes_.length;
    }

    /**
     * Adds a new node
     * @param {player.NodeDetails} nodeDetails
     * @return Promise.resolve({string}) On success resolves nodeId
     */
    add(nodeDetails)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            let nodeId = nodeDetails.id ? nodeDetails.id : this.getNextId();
            nodeDetails.id = nodeId;
            this.nodes_[nodeId] = cloneObject(nodeDetails);

            return resolve(nodeId);
        }.bind(this));
    }

    /**
     * Retrieve Node
     * @return Promise.resolve({player.NodeDetails}) On success resolves the
     *         matching node
     */
    get(id)
    {
        var promise = promiseutils.createPromise( function(resolve, reject) {
            if (!id in this.nodes_)
            {
                return reject('Unexistent ID');
            }
            let match = this.nodes_[id];
            return resolve(match);
        }.bind(this));

        return promise;
    }

    /**
     * Saves an node item's state
     * @param {string} id  - the nodeId
     * @param {player.ItemState}  itemState - the item state
     * @return Promise.resolve({string}) On success resolves state id (uuid)
     */
    saveState(id, itemState)
    {
        return promiseutils.createPromise( function(resolve, reject) {
            if (!this.nodes_[id]) {
                return reject('Unexistent ID');
            }
            // @todo - use array instead, and resolve a uuid
            this.nodes_[id].itemState = cloneObject(itemState);

            // Add evalResult records
            if (itemState['@type'] === 'evaluation') {
                if (!('evalDetails' in this.nodes_[id])) {
                    this.nodes_[id].evalDetails = [];
                }
                this.nodes_[id].evalDetails.push(cloneObject(itemState));
            }
            return resolve();
        }.bind(this));
    }

    getNextId()
    {
        //(Math.floor((Math.random() * 1000) + 1)).toString()
        return 'LOCAL-' + (this.currId_++).toString();
    }

}
