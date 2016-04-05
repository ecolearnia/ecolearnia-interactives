/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.2
 *
 * @fileoverview
 *  This file includes the definition of EliReactComponent abstract class.
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

var React = require('react');
import utils from '../../libs/common/utils';

/**
 * @class EliReactComponent
 * @abstract
 *
 * @module interactives/components
 *
 * @classdesc
 *  Abstract class which all React-based EL-I components should extend.
 *
 */
export default class EliReactComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        /**
         * Unsubscription function.
         */
        this.unsubscribe;
    }

    subscribeToStateChange()
    {
        let componentId = '<anon-component>';
        let nodeId = '<anon-node>';
        if (this.props.context) {
            componentId = this.props.context.getComponentId();
            if (this.props.context.getNodeId) {
                nodeId = this.props.context.getNodeId();
            }
        }
        // @todo - use store's observeChanges() instead to listen to changes to
        //         specific state properties.
        this.unsubscribe = this.props.store.subscribe(function() {
            console.log('[' + nodeId +':'+ componentId + '@' + this.constructor.name + '] state updated! ' + JSON.stringify(this.props.store.getState('components')));
            this.forceUpdate();
        }.bind(this));
    }

    /**
     * React component completed mounting
     */
    componentDidMount()
    {
        // Subscribe to state change
        this.subscribeToStateChange();
    }

    /**
     * React component about to unmounting
     */
    componentWillUnmount()
    {
        let componentId = '<anon-component>';
        let nodeId = '<anon-node>';
        if (this.props.context) {
            componentId = this.props.context.getComponentId();
            if (this.props.context.getNodeId) {
                nodeId = this.props.context.getNodeId();
            }
        }
        console.log('[' + nodeId +':'+ componentId + '@' + this.constructor.name + '] componentWillUnmount.');
        if (this.unsubscribe) {
            console.log('[' + nodeId +':'+ componentId + '] unsubscribing.');
            this.unsubscribe();
        }
    }

    /**
     * Returns the ID of this component instance
     */
    componentId()
    {
        return (this.componentId_) ? this.componentId_ : '<anon-component>';
    };

    /**
     * Returns the ID of this component instance
     */
    nodeId()
    {
        return (this.nodeId_) ? this.nodeId_ : '<anon-node>';
    };

    /**
     * Returns the DOM class name mostly for styling
     */
    classNameFor(objName)
    {
        // @todo - exteranlize
        let foundationTheme = {
            cell: {
                numeric: 'text-right'
            },
            button: {
                _default: "button",
                primary: "button primary",
                secondary: "button secondary",
                success: "button success",
                warning: "button warning",
                alert: "button alert"
            }
        };
        return utils.dotAccess(foundationTheme, objName);
    }
}

/**
 * Binds each of the methods to the this context
 * @see http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
 */
EliReactComponent.prototype.bind_ = function(...methods)
{
    methods.forEach( (method) => this[method] = this[method].bind(this) );
};




/**
 * Returns the kind of this component (react)
 * @returns {string}
 */
EliReactComponent.prototype.componentKind = function()
{
    return 'react';
};

EliReactComponent.propTypes = {
    // Component's context
    context: React.PropTypes.object.isRequired,
    /**
     * @type {StoreFacade}
     * Container's state store
     */
    store: React.PropTypes.object.isRequired
};
