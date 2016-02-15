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

var _ = require('lodash');
import { PubSub } from '../../libs/common/pubsub';
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk';

/**
 * @class StateFacade
 *
 * @module interactives/core
 *
 * @classdesc
 *  StoreFacade is a wrapper around Redux Store.
 *
 */
export default class StoreFacade
{
    /**
     * constructor
     * @param {Object} reducers - Map of {reducerName: reducerFunc}
     */
    constructor(reducers)
    {
        const rootReducer = _.isFunction(reducers) ?
            reducers : combineReducers(reducers);

        this.store_ = createStore(
            rootReducer,
            applyMiddleware(thunk)
        );
    }

    /**
     * Registers dispatcher
     */
    registerDispatcher(dispatcher)
    {
        dispatcher.setStore(this);
        this.dispatcher_[dispatcher.name] = dispatcher;
    }

    /**
     * Returns dispatcher
     */
    dispatcher(name)
    {
        return this.dispatcher_[name];
    }

    getState(name)
    {
        if (name != undefined)
            // Assuming the state is Immutablejs 
            return this.store_.getState()[name].toJS();
        return this.store_.getState();
    }

    /**
     * Dipspatches the action
     */
    dispatch(action)
    {
        return this.store_.dispatch(action);
    }

    dispose()
    {
        //this.store.dispose();
    }

}
