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

import StoreFacade        from '../../core/storefacade';
import assignmentReducers from './assignmentreducers';
import ItemPlayer         from '../item/itemplayer';

import ScoreBoardComponent from './components/scoreboard.jsx';
import ReportComponent    from './components/report.jsx';

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
         * The logger
         */
        this.logger_ = logger.getLogger('AssignmentPlayer');

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
            activityProvider: config.activityProvider,
            evaluator: config.evaluator,
            componentNamespace: 'interactives',
            pubsub: this.pubsub_
        };

        /**
         * The item player instance which manages an item content
         */
        this.itemPlayer_ = new ItemPlayer(itemPlayerConfig);

        /**
         * @type {SequencingStrategy}
         *    has operations: get(index), and getNext()
         */
        this.sequencingStrategy_ = config.sequencingStrategy;

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

        return this.loadNextItem();
    }

    calcStats()
    {
        let itemEvalBriefs = this.store_.getState()['itemEvalBriefs'].toArray();

        let stats = {
            score: 0,
            corrects: 0,
            incorrects: 0,
            semicorrects: 0
        };
        for (let i=0; i < itemEvalBriefs.length; i++) {
            if (itemEvalBriefs[i].aggregateResult) {
                stats.score += itemEvalBriefs[i].aggregateResult.score;
                if (itemEvalBriefs[i].pass) {
                    stats.corrects++;
                } else {
                    if (itemEvalBriefs[i].score == 0) {
                        stats.incorrects++;
                    } else {
                        // Partial correct
                        stats.semicorrects++;
                    }
                }
            }
        }
        return stats;
    }


    /**
     * loads the next item in the sequence
     * Next item involves intantiation of a new activity
     */
    loadNextItem()
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        let report = this.store_.getState('report');
        var context = {
            stats: (report) ? report.stats: null
        };
        return this.sequencingStrategy_.retrieveNextActivity(context)
        .then(function(activityDescriptor){
            this.pubsub_.publishRaw('next-activity-retrieved', activityDescriptor);
            if (activityDescriptor) {
                return this.fetchItemAndRender_(activityDescriptor)
                .then(function(activityDescriptor){
                    // When successfully loaded, create a slot in the report for
                    // the item. This will keep proper ordering even if the
                    // student skips the item and submits later on
                    if (activityDescriptor) {
                        this.store_.dispatch({
                            type: 'ADD_EVAL_BRIEF',
                            activityId: activityDescriptor.id,
                            attemptNum: 0,
                            aggregateResult: null
                        });
                    }
                }.bind(this));
            } else {
                // resolve to null, nothing else to do.
                return Promise.resolve(null);
            }
        }.bind(this));
    }

    /**
     * loads an previously intantiated item in the sequene
     */
    loadItemByActivityId(activityId)
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        return this.sequencingStrategy_.retrieveActivity(activityId)
        .then(function(activityDescriptor){
            this.pubsub_.publish('activity-retrieved', activityDescriptor);

            return this.fetchItemAndRender_(activityDescriptor);
        }.bind(this));
    }

    /**
     * loads an previously intantiated item in the sequene
     */
    loadItemByIndex(index)
    {
        // @todo - set properly the assignmentContext
        // Not sure to pass the courseContext, learningContext or assignmentContext,
        return this.sequencingStrategy_.retrieveActivityByIndex(index)
        .then(function(activityDescriptor){
            this.pubsub_.publish('activity-retrieved', activityDescriptor);

            return this.fetchItemAndRender_(activityDescriptor);
        }.bind(this));
    }

    /**
     * Load the assignment report (at the end of assignment,
     * when no more items left)
     */
    loadReport()
    {
        //let stats = this.store_.getState('stats')
        // this.placeholders_?
        if (this.placeholders_.content) {
            ReactDOM.render(<ReportComponent store={this.store_} context={null} />, this.placeholders_.content);
        }
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
    fetchItemAndRender_(activityDescriptor)
    {
        return this.itemPlayer_.fetchActivityAndRender(activityDescriptor, this.itemEl_);
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
        this.logger_.debug({message: message}, 'handleSubmissionBeforeRequestEvent_');
    }

    /**
     * Function to handle submission
     * This event is useful when the assignment UI needs to respond to feedback.
     */
    handleSubmissionRespondedEvent_(message)
    {
        message.activityId;
        message.data.evalResult;

        this.store_.dispatch({
            type: 'ADD_EVAL_BRIEF',
            activityId: message.activityId,
            attemptNum: message.data.evalResult.attemptNum,
            secondsSpent: message.data.submission.secondsSpent,
            aggregateResult: message.data.evalResult.aggregate
        });

        this.logger_.debug({message: message}, 'handleSubmissionRespondedEvent_');
    }

    /**
     * Function to handle navigation
     */
    handleNavigateEvent_(message)
    {
        this.logger_.debug({message: message}, 'handleNavigateEvent_');

        if (message.param === 'next') {
            // @todo - pass context
            return this.loadNextItem();
        } else if (_.isNumber(message.param)) {
            return this.loadItemByIndex(message.param);
        }
    }
}
