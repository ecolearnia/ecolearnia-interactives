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
 *  This file includes the definition of RandomVarSequencingStrategy class.
 *
 * @author Young Suk Ahn Park
 * @date 1/02/16
 */
var promiseutils = require('../../../libs/common/promiseutils');
import {dotAccess} from '../../../libs/common/utils';
import VariableRandomizer from './variablerandomizer.js';

 /**
  * @class RandomVarSequencingStrategy
  *
  * @module interactives/player/assignment
  *
  * @classdesc
  *  This sequencing strategy takes a content and generates N number of
  * intsances.
  *  The content should be a template content, i.e. it should have variable
  * declaration and the question prompts should be referencing them.
  *
  * MUST implement the following methods:
  * retrieveNode(index) -> Promise.resolve(SequenceNode)
  * retrieveNextNode() -> Promise.resolve(SequenceNode)
  */
export default class RandomVarSequencingStrategy
{
    /**
     * @param {Object} config - the config
     */
    constructor(config)
    {
        /**
         * @type {string} the URL of the template content
         */
        this.resourceUrl_;

        /**
         * template content
         */
        this.templateContent_;

        // Assign values if provided
        if (config) {
            this.resourceUrl_ = config.resourceUrl;
            this.templateContent_ = config.templateContent;
        }

        /**
         * Array of instantiated contents
         * @type Array<SequenceNodes>
         */
        this.nodes_ = [];

        /**
         * Index of the current node;
         */
        this.cursor_ = 0;
    }

    /**
     * Set the assignment context
     * The assignment context include:
     * assemblySettings: {
     *     numItemInstances: number of questions to instantiate
     *   }
     * currentItem: associationId of the current (last) item touched.
     */
    setAssignmentContext(assignmentContext)
    {
        this.assignmentContext_ = assignmentContext;
        if (!this.assignmentContext_ || !this.assignmentContext_.assemblySettings)
        {
            throw new Error('Missing property assignmentContext.assemblySettings');
        }
        if (!this.assignmentContext_.assemblySettings.numItemInstances)
        {
            this.assignmentContext_.assemblySettings.numItemInstances = 10;
        }
    }

    /**
     * Gets the node in the sequence history
     */
    retrieveNode(index)
    {
        if (index < this.nodes_.length) {
            return Promise.resolve(this.nodes_[index]);
        } else {
            return Promise.reject("Index out of bounds");
        }
    }

    /**
     * Get next node
     * @return {promise} - On success the next sequenceNode (object containing associationId, item content)
     */
    retrieveNextNode(assignmentContext)
    {
        let self = this;
        let numItemInstances = dotAccess(assignmentContext, 'assemblySettings.numItemInstances');
        numItemInstances = numItemInstances || 10;
        if (self.nodes_.length >= numItemInstances)
        {
            // Reached end of assignment item.
            return Promise.resolve(null);
        }

        return self.getTemplateContent_()
        .then(function(content){
            var randomizer = new VariableRandomizer();
            let newNode = {
                // Create a random number for the associationId                // @todo -
                associationId: (Math.floor((Math.random() * 1000) + 1)).toString(),
                content: randomizer.apply(content)
            };
            self.nodes_.push(newNode);
            return newNode;
        });
    }

    /**
     * Gets the template content
     */
    getTemplateContent_()
    {
        let self = this;
        return promiseutils.createPromise( function(resolve, reject) {

            if (self.templateContent_) {
                return resolve(self.templateContent_);
            }

            if (!self.resourceUrl_) {
                return reject('resourceUrl not defined');
            }
            $.getJSON(self.resourceUrl_, function( data ) {
                if (data && data.variableDeclarations) {
                    self.templateContent_ = data;
                } else {
                    return reject('There is no variable in the content definition');
                }
                return resolve(self.templateContent_);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                return reject(textStatus);
            });

        }.bind(this));
    }
}
