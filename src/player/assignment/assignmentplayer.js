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

import utils  from '../../../libs/common/utils';
import logger from '../../../libs/common/logger';
import PubSub from '../../../libs/common/pubsub';

import StoreFacade       from '../storefacade';
import assignmentReducers  from './assignmentreducers';
import ItemPlayer from '../item/itemplayer';

import ScoreBoardComponent from './components/scoreboard.jsx';

/**
 * @class AssignmentPlayer
 *
 * @module interactives/player/assignment
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
    /**
     * @constructor
     *
     * @param {object} config
     */
    constructor(config)
    {
        /**
         * DOM element placeholders to render the assignment item
         * Assigned by the load() method
         * @type{Mapp.<{string} placeholderName, {DOM} el}
         */
        this.placeholders_;

        /**
         * Eventing
         */
        this.pubsub_ = new PubSub();

        // Item Player Config
        var itemPlayerConfig = {
            nodeProvider: config.nodeProvider,
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

        /**
         * Flux Store
         */
        this.store_ = new StoreFacade(assignmentReducers);


        // Start listening to events
        this.subscribeToEvents_();
    }

    render(placeholders)
    {
        this.placeholders_ = placeholders;
        // @todo - select the element for item
        this.itemEl_ = placeholders.content;


        if (placeholders.scoreboard) {
            ReactDOM.render(<ScoreBoardComponent store={this.store_} context={null} />, placeholders.scoreboard);
        }

        this.loadNextItem();
    }


    /**
     * loads the next item in the sequence
     * Next item involves intantiation of a new node
     */
    loadNextItem()
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        var context = {};
        return this.sequenceStrategy_.retrieveNextNode(context)
        .then(function(nodeDescriptor){
            this.pubsub_.publishRaw('next-node-retrieved', nodeDescriptor);
            return this.fetchItemAndRender_(nodeDescriptor);
        }.bind(this));
    }

    /**
     * loads an previously intantiated item in the sequene
     */
    loadItemByNodeId(nodeId)
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        return this.sequenceStrategy_.retrieveNode(nodeId)
        .then(function(nodeDescriptor){
            this.pubsub_.publish('node-retrieved', nodeDescriptor);

            return this.fetchItemAndRender_(nodeDescriptor);
        }.bind(this));
    }

    /**
     * loads an previously intantiated item in the sequene
     */
    loadItemByIndex(index)
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        return this.sequenceStrategy_.retrieveNodeByIndex(index)
        .then(function(nodeDescriptor){
            this.pubsub_.publish('node-retrieved', nodeDescriptor);

            return this.fetchItemAndRender_(nodeDescriptor);
        }.bind(this));
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



    /*************************
     * private functions
     */


     /**
      * Loads an item content and render it
      */
     fetchItemAndRender_(nodeDescriptor)
     {
         return this.itemPlayer_.fetchNode(nodeDescriptor)
         .then(function(){
             this.itemPlayer_.render(this.itemEl_);
             return;
         }.bind(this));

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
        this.subscribe('submission:beforeRequest', function(message) {
            this.handleSubmissionBeforeRequestEvent_(message);
        }.bind(this));

        /*
         * Item's submission has been responded
         * Message structure:
         * {
         *   associationId: {string} - the item's association' ID
         *   data: {Object} - evalDetails
         * }
         */
        this.subscribe('submission:responded', function(message) {
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
     * Function to handle submission before request
     * This event is useful when the assignment UI needs to disable the
     * submission button.
     */
    handleSubmissionBeforeRequestEvent_(message)
    {
        console.log('handleSubmissionBeforeRequestEvent_:' + JSON.stringify(message));
    }

    /**
     * Function to handle submission
     * This event is useful when the assignment UI needs to respond to feedback.
     */
    handleSubmissionRespondedEvent_(message)
    {
        message.nodeId;
        message.data.evalResult;

        // calculare overall correctness
        /*
        let isCorrect = this.isOverallCorrect(message.data.evalResult);
        if (isCorrect) {
            this.store_.dispatch({type: "STATS_INC_CORRECT"});
        } else {
            this.store_.dispatch({type: "STATS_INC_INCORRECT"});
        }*/
        this.store_.dispatch({type: "STATS_ACCUMULATE", aggregateResult: message.data.evalResult.aggregate});

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