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

import ComponentContext  from '../../src/components/componentcontext';
import StoreFacade       from '../../src/core/storefacade';
import ItemDispatcher    from '../../src/core/itemdispatcher';
import ItemActionFactory from '../../src/core/itemactionfactory';
import itemReducers      from '../../src/core/itemreducers';
import LocalEvaluator    from '../../src/core/localevaluator';

/**
 * @class ItemPlayer
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
 * @constructor
 *
 * @param {object} config
 *
 */
export class ItemPlayer
{
    constructor(config)
    {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('ItemPlayer');

        /**
         * PubSub: component than handles events
         * @type {PubSub}
         */
        this.pubsub = config.pubsub;

        /**
         * Decorator: Decorates UI components by adding styles.
         * @type {null}
         */
        this.decorator_ = null;

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
         * The content which this context is operating on
         * @type {Object}
         */
        this.content_ = null;

        /**
         * Map of component id and it's specification (description)
         * @type {Object}
         * @private
         */
        this.componentSpecs_ = {};


        /**
         * ID used to retrieve the LearnerAssignmentItem, the content instance
         * with associated user/course.
         * The server uses the retrieved LearnerAssignmentItem to evaluate the
         * submission and append the result (activity).
         */
        this.associationId_ = config.associationId || (Math.floor((Math.random() * 1000) + 1)).toString();

        this.setContent(config.content); // the content body

        /**
         * Flux Store
         */
        this.store_ = new StoreFacade(itemReducers);

        var evaluator = null;
        if (config.evaluator && config.evaluator === 'remote') {
            evaluator = new RemoteEvaluator();
        } else {
            evaluator = new LocalEvaluator();
            evaluator.registerItemPlayer(this);
        }

        this.dispatcher_ = new ItemDispatcher({
            actionFactory: new ItemActionFactory(evaluator)
        });
        this.dispatcher_.setStore(this.store_);

        /**
         * Reference to component instances
         * @type {Object} Map where keys are component ids and value are the components instances
         */
        this.componentReferences_ = {};

    };

    /*** Static methods ***/

    /**
     *
     * @param fqn
     * @returns {object}
     *      Format: { domain: <definition|components>, id: (string) }
     */
    static parseFqn(fqn)
    {
        var retval = {};
        if (fqn) {
            if (fqn[0] === '.') {
                var parts = fqn.split('.');
                retval.domain = parts[0];
                retval.id = parts.shift();
            } else {
                retval.id = fqn;
            }
        }
        return retval;
    }

    /*** Member methods ***/

    /**
     * Gets the item association Id (aka itemId).
     *
     * @param {string} content
     */
    getAssociationId()
    {
        return this.associationId_;
    }

    /**
     * Gets the content.
     *
     * @param {object} content
     */
    getContent()
    {
        return this.content_;
    }

    /**
     * Sets the content.
     * Triggers re-rendering.
     *
     * @todo - Trigger re-rendering
     *
     * @param {object} content
     */
    setContent(content)
    {
        /**
         * The content which this context is operating on
         * @type {Object}
         */
        this.content_ = content;

        // Convert component spec from array to Object map for efficient
        // retrieval.
        // the components are already in form of map
        this.componentSpecs_ = content.item.components;

        this.logger_.debug('Component set.');

    }

    /**
     * getValue
     *
     * Returns the parameter itself unless it contains a local reference which is
     * a fully qualified name (fqn) of a model object or component object
     *
     * @param {object} param  - the parameter which could be the value itself
     *      or may be an object which contains "_ref" denoting a local fully
     *      qualified name to where the actual value is.
     */
    getValue(param)
    {
        var retval = param;
        // If it contains a local reference, get the object it points to.
        if (param._ref)
        {
            retval = this.resolveObject(param._ref);
        }
        return retval;
    }

    /**
     * resolveObject
     *
     * Returns the model object or component object
     *
     * @param {string} fqn  - the Fully Qualified Name of the object
     */
    resolveObject(fqn)
    {
        var retval;

        if (utils.startsWith(fqn, '.'))
        {
            // if it starts with '.model' returns the JSON object,
            if (utils.startsWith(fqn, '.model'))
            {
                var refPath = fqn.substring('.model.'.length );
                retval = utils.dotAccess(this.content_.modelDefinition, refPath);
            }

            // if it starts with '.component' returns the Component object\
            else if (utils.startsWith(fqn, '.component.'))
            {
                var componentId = fqn.substring(11);
                retval = this.getComponent(componentId);
            }
            else
            {
                throw new Exception('Wrong object path, must be either .model or .component')
            }
        }
        // Not starts with dot means it is already a component name.
        else
        {
            retval = this.getComponent(fqn);
        }

        return retval;
    }


    /**
     * Builds the components as specified in the spec
     *
     * @param {object} spec  - The specification of the components
     * @param {string} componentId  - id of the component
     *
     * @return {object}  The component instance (a React element)
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

    /**
     * getComponent
     *
     * Returns the component instance.
     * Either returns the existing object in the reference table, or creates
     * one, registers it and returns it.
     *
     * @param {string} id - The component Id
     *
     * @return {object} The component instance (a React element)
     */
    getComponent(id) {
        if (!(id in this.componentReferences_)) {
            if (!(id in this.componentSpecs_)) {
                throw new Error('Component ID not found');
            }
            this.componentReferences_[id] = this.createComponent(id);
        }
        return this.componentReferences_[id];
    }

    /**
     * renderComponent
     *
     * Renders the component to specific DOM element
     *
     * @param {string} param  - The component or the component id
     * @param {DOM} el  - DOM element to render the component
     * @return {DOM}  - The el
     */
    renderComponent(param, el)
    {
        // We are assuming that if the param is a string, then it is the
        // component id; otherwise is the component itself;
        var component = param;
        if (typeof param === 'string') {
            component = this.getComponent(param);
        }

        // Little hack so I can get the component type from Backbone's view or React.
        // React provides componentKind() method through mixin
        var componentKind = (component.componentKind) ? component.componentKind() : component.type.prototype.componentKind();

        // @todo - Implement strategy pattern to handle different componentKinds
        if (componentKind === 'react') {
            ReactDOM.render(component, el);
        } else {
            component.render();
            el.appendChild(component.el);
        }

        return el;
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
    render()
    {
        if (!this.content_ || !this.content_.item.mainComponent) {
            throw new Error('No component was specified');
        }
        var mainComponentId = this.content_.item.mainComponent;
        return this.renderComponent(mainComponentId, this.el_);
    }

    load(el) {
        this.el_ = el;
        this.render();

        let self = this;
        var mainComponent = this.getComponent(this.content_.item.mainComponent);

        //this.storeUnsubscribe_ = this.store_.subscribe(() => this.render());
    }

}
