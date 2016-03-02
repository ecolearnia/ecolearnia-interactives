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
 *  This file includes the definition of ItemPlayer class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');

import utils from '../../libs/common/utils';
import logger from '../../libs/common/logger';
import PubSub from '../../libs/common/pubsub';

import ItemPlayer from './itemplayer';


/**
 * @class AssignmentPlayer
 *
 * @module interactives/core
 *
 * @classdesc
 *  Item Context manages the overall lifecycle and interaction of the
 *  components specified in a content item.
 *  Based on the item specification, it creates the components and renders
 *  them as needed.
 *  Besides the components, it also has the references to the dispatcher.
 *
 *  The object of this class is created using the factory method createItemPlayer().
 *
 */
export default class AssignmentPlayer
{
    /*
     * @constructor
     *
     * @param {object} config
     *
     */
    constructor(config)
    {
        /**
         * DOM element to render the assignment item
         * Assigned by the load() method
         */
        this.el_ = config.el;

        /**
         * Eventing
         */
        this.pubsub_ = new PubSub();

        this.subscribeToEvents_();

        // Item Player Config
        var itemPlayerConfig = {
            evaluator: config.evaluator,
            componentNamespace: 'interactives',
            pubsub: this.pubsub_
        }

        /**
         * The item player instance which manages an item content
         */
        this.itemPlayer_ = new ItemPlayer(itemPlayerConfig);

        /**
         * @type {SequencingStrategy}
         *    has operations: get(index), and getNext()
         */
        this.sequenceStrategy_ = config.sequencingStrategy;
    }

    load(el)
    {
        this.el_ = el;
        // @todo - select the element for item
        this.itemEl_ = el;
        this.loadNextItem();
    }

    /**
     * loads the next item in the sequene
     */
    loadNextItem()
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        var context = {};
        return this.sequenceStrategy_.retrieveNextNode(context)
        .then(function(node){
            this.pubsub_.publishRaw('next-node-retrieved', node);
            this.loadItem_(node);
        }.bind(this));
    }

    /**
     * loads the next item in the sequene
     */
    loadItem(index)
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        return this.sequenceStrategy_.retrieveNode(index)
        .then(function(node){
            this.pubsub_.publish('node-retrieved', node);
            this.loadItem_(node);
        }.bind(this));
    }

    /**
     * Load an item with the ItemPlayer
     *
     * @param {DOM} el - the DOM element to render the item
     * @param {string} associationId - the associationId
     * @param {Object} content - the EliContent object
     */
    loadItem_(node)
    {
        this.itemPlayer_.setContent(node.associationId, node.content);
        this.itemPlayer_.load(this.itemEl_);
    }

    /**
     * subscribe to events from the assignment player
     *
     * @param {string} topic - the topic
     * @param {function} listener - the function
     */
    subscribe(topic, listener)
    {
        this.pubsub_.subscribe(topic, listener);
    }

    /**
     * Subscribe to various events
     */
    subscribeToEvents_()
    {
        /*
         * Item's submission has been responded
         * Message structure:
         * {
         *   associationId: {string} - the item's association' ID
         *   data: {Object} - evalDetails
         * }
         */
        this.subscribe('submission-responded', function(message) {
            this.handleSubmissionRespondedEvent_(message);
        }.bind(this));

        /*
         * Navigation has been responded
         * Message structure:
         * {
         *   associationId: {string} - the item's association' ID
         *   param: 'f:1'
         * }
         * param's data: <direction>:<steps>
         *   where direction can be 'f' for forward and 'b' for backward
         *         steps is numeric value of how many steps to move
         */
        this.subscribe('navigate', function(message) {
            this.handleNavigateEvent_(message);
        }.bind(this));
    }

    /**
     * Function to handle submission
     */
    handleSubmissionRespondedEvent_(message)
    {
        console.log('handleSubmissionRespondedEvent_:' + JSON.stringify(message));
    }

    /**
     * Function to handle navigation
     */
    handleNavigateEvent_(message)
    {
        console.log('handleNavigateEvent_:' + JSON.stringify(message));
        if (message.param === 'next') {
            // @todo - pass context
            this.loadNextItem();
        } else if (_.isNumber(message.param)) {
            this.loadItem(message.param);
        }
    }
}
