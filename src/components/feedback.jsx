/*
 * This file is part of the EcoLearnia platform.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.1
 *
 * @fileoverview
 *  This file includes the definition of FeedbackComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var React = require('react');
var EliReactComponent = require('./elireactcomponent').EliReactComponent;
var Events = require('../core/events').Events;

var internals = {};

/**
 * @class FeedbackComponent
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the feedback.
 *  The feedback component is where the feedback messages including hints are
 *  displayed upon specific action.
 *
 * @todo - Implement!
 */
export class FeedbackComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
        this.bind_('handleEvaluatedEvent_');

        this.state = {
            evaluation: {}
        };

        /*
        this.props.itemContext.pubsub.subscribe(
            Events.ANSWER_EVALUATED,
            this.handleEvaluatedEvent_.bind(this)
        );
        */
    }

    handleEvaluatedEvent_(message)
    {
        if(message.source.itemId === this.itemAssociationId())
        {
            this.setState({evaluation: message.payload});
        }
    }

    render()
    {
        // The "eli" prefix in the className stands for EcoLearnia Interactive
        let evalsState = this.props.store.getState('evaluations');
        let lastEval = (evalsState && evalsState.length > 0) ? evalsState[evalsState.length-1] : null;

        var evalDump = lastEval ? JSON.stringify(lastEval.evalResult): null;
        /*
        <audio controls autoplay>
          <source src="http://www.w3schools.com/tags/horse.ogg" type="audio/ogg">
          Your browser does not support the audio element.
        </audio>

        */
        return (
            <div className="eli-feedback">
                {evalDump}
            </div>
        );
    }
}
