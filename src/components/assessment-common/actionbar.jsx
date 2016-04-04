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
 *  This file includes the definition of ActionBarComponent class.
 *
 * @author Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 * @date 5/13/15
 */

var React = require('react');
var Events = require('../../core/events').Events;
import EliReactComponent from '../../core/elireactcomponent';


/**
 * @class ActionBarComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the action bar.
 *  An action bar is the the interactive which user use to trigger actions
 *  such as submitting, text to speech, requesting hint, navigating to related
 *  learning contents, etc.
 *
 * @todo - Implement!
 */
export default class ActionBarComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
        //this.bind_('handleAction_');
    }

    componentWillUnmount () {
        // @todo - should anything happen here?
        super.componentWillUnmount();
    }

    handleAction_(type, e)
    {
        // e.preventDefault();
        switch (type) {
            case 'submit': this.props.context.dispatcher.evaluate();
        }
    }

    renderItem_(type)
    {
        let lastEval = this.props.context.getLastEval();
        let allowSubmit = lastEval ? (!lastEval.evalResult.aggregate.pass
            && lastEval.evalResult.attemptsLeft > 0): true;


        var retval = null;
        if (type == 'tts') {
            retval = <div><a onClick={this.handleAction_.bind(this, 'tts')} >audio-icon</a></div>
        }
        if (type == 'submit') {
            retval = <div><button className={this.classNameFor('button.primary')} disabled={!allowSubmit} onClick={this.handleAction_.bind(this, 'submit')} >Submit</button></div>
        }
        if (type == 'reset') {
            retval = <div><a onClick={this.handleAction_.bind(this, 'reset')} >Reset</a></div>
        }
        if (type == 'hint') {
            retval = <div><a onClick={this.handleAction_.bind(this, 'hint')} >Hint</a></div>
        }
        return retval;
    }

    render()
    {
        var items = this.props.context.getConfigVal('items');
    	var actionbarItems = items.map(function(item, i) {
            return (
                <div key={i}>{this.renderItem_(item)}</div>
            )
        }.bind(this));

		// The "eli" prefix in the className stands for EcoLearnia Interactive
        return (
            <div className="eli-actionbar">
                <ul >
	                <li >
                        {actionbarItems}
	                </li>
                </ul>
            </div>
        );
    }
};
