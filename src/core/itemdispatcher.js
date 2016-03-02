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
 * @date 2/10/2016
 */

//import { logger } from '../../libs/common/logger';
import ItemActionFactory from './itemactionfactory';

/**
 * @class ItemDispatcher
 *
 * @module interactives/core
 *
 * @classdesc
 *  ItemDispatcher object is a wrapper around store provising descripive
 *  functions for actions on the item.
 *  The obhect is meant to be instantiated by the player and use setStore()
 *  to set the store to wrap.
 *
 * @constructor
 *
 * @param {object} settings
 *
 */
export default class ItemDispatcher
{
    /**
     * constructor
     * @param {Object} evaluator - Reference to the evaluator object.
     */
    constructor(config)
    {
        if (config && config.actionFactory) {
            this.actionFactory_ = config.actionFactory;
        } else {
            throw new Exception('actionFactory not provided')
        }

        /**
         * @type {PubSub} for eventing
         */
        this.pubsub = (config && config.pubsub) ? config.pubsub : null;
    }

    /**
     * Sets the Store reference
     *
     */
    setStore(store)
    {
        this.store_ = store;
    }


    /**
     * updates state of a component
     */
    updateState(componentId, state)
    {
        return this.store_.dispatch(
            this.actionFactory_.updateState(componentId, state)
        );
    }

    evaluate(associationId)
    {
        let self = this;
        return this.store_.dispatch(
            this.actionFactory_.evaluate(associationId)
        ).then(function(data){
            console.log("yay!" + JSON.stringify(data));
            if (self.pubsub && data.type == 'ITEM_APPEND_EVALDETAILS') {
                // publish event
                // @todo - change string literals to constants
                self.pubsub.publish('submission-responded', {
                    associationId: associationId,
                    data: data.evalDetails
                });
            }
            // Re-return
            return data;
        });
    }

    appendMessage(message)
    {
        return this.store_.dispatch(
            this.actionFactory_.appendMessage(message)
        );
    }

}

ItemDispatcher.prototype.name = 'itemDispatcher';
