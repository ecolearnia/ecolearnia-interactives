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

var internals = {};

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
export class EliReactComponent extends React.Component
{
    constructor(props)
    {
        super(props);

        /**
         * Unsubscription function.
         */
        this.unsubscribe;

        //this.componentId_ = props.componentId;
    }

    subscribeToStateChange()
    {
        var self = this;
        this.unsubscribe = this.props.store.subscribe(function() {
            console.log('state updated! ' + JSON.stringify(self.props.store.getState('components')));
            self.forceUpdate();
        });
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
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

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
 * Returns the ID of this component instance
 */
EliReactComponent.prototype.componentId = function()
{
    return this.componentId_;
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
     * Player's item state store
     */
    store: React.PropTypes.object.isRequired
};
