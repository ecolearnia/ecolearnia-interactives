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
import { createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunk from 'redux-thunk';

/**
 * @class StateFacade
 *
 * @module interactives/player
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

        // Wrapper around ther reducers to handle
        // _RESET_ action
        // @see: http://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
        const resettableReducer = (state, action) => {
            if (action.type === '_RESET_') {
                state = undefined;
            }
            return rootReducer(state, action)
        };

        this.store_ = createStore(
            resettableReducer,
            compose(
                applyMiddleware(thunk),
                // window.devToolsExtension is the Redux Chrome DevTools
                // @see https://developer.chrome.com/devtools
                (typeof window !== 'undefined' && window.devToolsExtension)
                    ? window.devToolsExtension() : f => f
            )
        );

    }

    /**
     * Registers dispatcher
     * A dispatcher is an object with convinence methods that issues
     * different actions. It basically generates action objects and calls
     * store's dispach() method.
     *
     * @param {Dispatcher} dispatcher
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

    /**
     * Reset store
     */
    reset()
    {
        return this.dispatch({
            type: '_RESET_'
        });
    }

    /**
     * subscribe to store change
     * @param {function} listener
     */
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
     * Dispatches an action
     * @param {object} action - the action to dispatch.
     *      At minimum the action contains type property.
     */
    dispatch(action)
    {
        return this.store_.dispatch(action);
    }

    /**
     * disposes this store
     */
    dispose()
    {
        //this.store.dispose();
    }

}
