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
import { createStore, applyMiddleware, combineReducers, compose} from 'redux'
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
            compose(
                applyMiddleware(thunk),
                (typeof window !== 'undefined' && window.devToolsExtension) ? window.devToolsExtension() : f => f
            )
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

    subscribe(listener)
    {
        return this.store_.subscribe(listener);
    }

    /**
     * returns the state
     *
     * @param {!string} name - the name of the top level property
     */
    getState(name)
    {
        var state;
        if (name != undefined){
            state = this.store_.getState()[name];
            return this.store_.getState()[name].toJS();
        } else {
            state = this.store_.getState();
        }
        // If the state is of type Immutablejs, return the native java value.
        return (state.toJS) ? state.toJS() : state;
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
