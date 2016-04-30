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

import utils  from '../../../libs/common/utils';
import logger from '../../../libs/common/logger';

import StoreFacade       from '../../core/storefacade';
import ItemActionFactory from './itemactionfactory';
import ItemDispatcher    from './itemdispatcher';
import itemReducers      from './itemreducers';
import ItemWrapper       from './itemwrapper';

// @todo - change to RemoteEvaluator when ready
import LocalEvaluator    from '../localevaluator';

/**
 * @class ItemPlayer
 *
 * @module interactives/player/item
 *
 * @classdesc
 *  Item Player manages the overall lifecycle and interaction of the
 *  components defined in a content item.
 *  Based on the item specification, it creates the components and renders
 *  them as needed.
 *  Besides the components, it also has the references to the dispatcher.
 *
 *  The object of this class is created using the factory method createItemPlayer().
 *
 */
export default class ItemPlayer
{
    /**
     * @param {object} config
     */
    constructor(config)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('ItemPlayer');

        /**
         * PubSub: component than handles events (aka event emitter)
         * @type {PubSub}
         */
        this.pubsub = config.pubsub;

        /**
         * The namespace to look for the components
         */
        this.componentModule_ = global;
        if (config.componentModule) {
            this.componentModule_ = config.componentModule;
        }
        else if (config.componentNamespace) {
            this.componentModule_ = global[config.componentNamespace];
            this.logger_.info({ componentNamespace: config.componentNamespace} );
        }

        /**
         * @type {ActivityProvider} object that provides activity
         */
        this.activityProvider_ = config.activityProvider;

        /**
         * Flux Store
         */
        this.store_ = new StoreFacade(itemReducers);

        // Evaluator is needed for the ItemActionFactory
        var evaluator = config.evaluator;
        // @todo change fallback to RemoteEvaluator when available
        evaluator = evaluator || new LocalEvaluator({});

        /**
         * The dispatcher instance
         */
        this.dispatcher_ = new ItemDispatcher({
            pubsub: this.pubsub,
            actionFactory: new ItemActionFactory(),
            activityProvider: this.activityProvider_,
            evaluator: evaluator
        });
        this.dispatcher_.setStore(this.store_);

        /**
         * The item to be played
         * @type {ItemWrapper}
         */
        this.item_ ;

        /* Disable manual setting
        if (config.content) {
            let associationId = config.associationId || (Math.floor((Math.random() * 1000) + 1)).toString();
            this.setContent(associationId, config.content); // the content body
        }*/
    }


    /**
     * render
     *
     * Renders the main component on the element
     *
     * @param {DOM} el
     *
     * @returns {DOM}
     */
    render(el)
    {
        this.el_ = el;

        let mainComponentEl = this.item_.renderMainComponent(this.el_);

        this.dispatcher_.timestampStart();
        return mainComponentEl;
    }

    /**
     * fetchActivity
     * Fetches the content from System-of-records and set the content
     * @param {ActivityDescriptor} activityDescriptor
     */
    fetchActivity_(activityDescriptor)
    {
        let self = this;
        return this.activityProvider_.fetch(activityDescriptor.assignmentUuid, activityDescriptor.uuid)
        .then(function(activityDetails){
            let itemConfig = {
                componentModule: self.componentModule_,
                store: self.store_,
                dispatcher: self.dispatcher_
            };
            if (self.item_) {
                self.item_.dispose();
            }
            self.item_ = new ItemWrapper(itemConfig);
            self.item_.setContent(activityDetails);

            return activityDetails;
        });
    }

    /**
     * fetchActivity & restores state
     * Fetches the the activity and restores its state
     * @param {ActivityDescriptor} activityDescriptor
     */
    fetchActivityAndRender(activityDescriptor, el)
    {
        return this.fetchActivity_(activityDescriptor)
        .then(function(activityDetails){
            this.logger_.info('activityDetails.timestamps:', activityDetails.timestamps);
            if (activityDetails.timestamps) {
                // set timestamps
                this.dispatcher_.restoreTimestamps(
                    activityDetails.timestamps
                );
            }
            // Render will add a start timestamp
            this.render(el);

            if (activityDetails.itemState) {
                // @todo - later it will change to array of states, array tail
                // being the last state
                let isEvaluation = (activityDetails.itemState['@type'] === 'evaluation');

                let stateData = isEvaluation ? activityDetails.itemState.data.submission.fields : activityDetails.itemState.data.fields;

                // @todo - fix:
                // This produces forceUpdate before component being rendered
                // Calling an asyc method, Promise warning can be ignored
                this.dispatcher_.updateState(
                    activityDetails.assignmentUuid,
                    activityDetails.uuid,
                    'fields',
                    stateData,
                    true // Skip saving to the system or records, we just need to render
                );

                if (isEvaluation)
                {
                    // Notice appendEvalDetails, as opposed to evaluate(), only
                    // updates the store
                    this.dispatcher_.appendEvalDetails(activityDetails.itemState.data);
                }


            }

            return activityDescriptor;
        }.bind(this));
    }

}
