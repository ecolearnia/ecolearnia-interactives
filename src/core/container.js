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
 * @date 3/30/2016
 */


/**
 * @class Container
 *
 * @module interactives/core
 *
 * @classdesc
 *  StoreFacade is a wrapper around Redux Store.
 *
 */
export default class Container
{
    /**
     * constructor
     * @param {Object} reducers - Map of {reducerName: reducerFunc}
     */
    constructor(pubsub, dispatcherContext)
    {
        /**
         * DOM element placeholders to render the assignment item
         * Assigned by the load() method
         * @type{Mapp.<{string} placeholderName, {DOM} el}
         */
        this.placeholders_;

        /**
         * PubSub: component than handles events (aka event emitter)
         * @type {PubSub}
         */
        this.pubsub = pubsub;

        /**
         * @type {<componentTypeName>: { module: <moduleName>, class: <TypeClass>, dispatcher: <dispatcher>}}
         */
        this.componentTypes_ = {};

        /**
         * Map of reduces
         * @type {Map.<reducerName, Function(state, action)>}
         */
        this.reducers_ = {};

        /**
         * Map of distpatchers
         * @type {Map.<moduleName, Dispatcher>}
         */
        this.dispatchers_ = {};

        /**
         * Context passed to the dispatcher constructor.
         * The dispatcherContext contains references to objects that is shared
         * acros all dispatchrs.
         * Useful for passing application specific objecs such as evaluator.
         * @type{Map.<name, Object}
         */
        this.dispatcherContext = dispatcherContext;


        /**
         * Flux Store
         * @type {StoreFacade}
         */
        this.store_ ;


        // Start listening to events
        this.subscribeToEvents_();
    }

    getStore()
    {
        return this.store_;
    }

    /**
     * Returns the dispatcher for the module
     * @param {string} - the module name that the dispatcher pertains
     */
    getDispatcher(moduleName)
    {
        return this.dispatchers_[moduleName];
    }

    /**
     * Returns the dispatcher for the component
     * @param {string} - the type(class) of the component
     */
    getDispatcherForComponent(componentType)
    {
        return this.componentTypes_[componentType].dispatcher;
    }

    render(placeholders)
    {
        this.composition.render(placeholders);
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
     * Registers a module
     * @param {Object} module -
     * {
     *   componentTypes: [<ComponentClass>, ...],
     *   reducers: { <reducerName>: <reducerFunction> }
     *   dispatcher: dispatcherClass
     * }
     */
    registerModule(module)
    {
        // @todo - Check for dependencies

        this.reducers_[module.name] = module.reducers;

        let dispatcher = new module.dispatcherClass(this.store_, this.dispatcherContext);
        this.dispatchers_[module.name] = dispatcher;

        for (var i=0; i < module.componentTypes.length; i++) {
            // For the mean time we are assuming there is no name clashes
            let componentClass = module.componentTypes[i];

            if (componentClass.constructor.name in internals.componentTypes_)
            {
                throw Error("The component " + componentClass.constructor.name + " already exists");
            }

            this.componentTypes_[componentClass.constructor.name] = {
                module: module.name,
                componentClass: componentClass,
                dispatcher: dispatcher
            };
        }

    }

    /**
     * Initializes store with the reducers
     * Pre-condition: All the modules should have been registered
     */
    initStore()
    {
        this.store_ = new StoreFacade(this.reducers_);

        for (var moduleName in this.dispatchers_) {
            this.dispatchers_[moduleName].setStore(this.store_);
        }
    }

    /**
     * Builds the components as specified in the spec
     *
     * @param {object} spec  - The specification of the components
     * @param {string} componentId  - id of the component
     *
     * @return {player.Component}  The component instance (a React element)
     */
    createComponent(componentId)
    {
        let spec = this.componentSpecs_[componentId];
        if (!(spec.type in this.componentModule_)) {
            throw new Error('Component ' + spec.type + ' not found in module');
        }
        var componentClass = this.componentModule_[spec.type];

        var componentKind = componentClass.prototype.componentKind();

        var constructorArg = {
            context: new ComponentContext(componentId, this),
            store: this.store_
        };

        var retval = null;
        if (componentKind === 'react') {
            retval = React.createElement(componentClass, constructorArg);
        } else {
            retval = new componentClass(constructorArg);
        }
        this.logger_.info(
            { componentKind: componentKind, type: spec.type, id: componentId},
            'Component created'
        );

        return retval;
    }
}
