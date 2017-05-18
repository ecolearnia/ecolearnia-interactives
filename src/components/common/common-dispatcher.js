
/**
 * @class ItemDispatcher
 *
 * @module interactives/player/item
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
export default class CommonDispatcher
{
    /**
     * constructor
     * @param {Object} evaluator - Reference to the evaluator object.
     */
    constructor(store, config)
    {
        /**
         * @type {PubSub} for eventing
         */
        this.pubsub = (config && config.pubsub) ? config.pubsub : null;

        /**
         * @type {StoreFacade}
         */
        this.store_;
    }

    /**
     * Sets the Store reference
     * @param {StoreFacade} store;
     */
    setStore(store)
    {
        this.store_ = store;
    }

    setBreadcrumbs(items)
    {
        return this.store_.dispatch({
                type: 'COMMON_SET_BREADCRUMBS',
                items: items
            });
    }
}
