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
var EliReactComponent = require('../../core/elireactcomponent').EliReactComponent;
var Events = require('../../core/events').Events;

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
export default class FeedbackComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
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

        let feedbackPane = '';
        if (lastEval) {
            if (lastEval.evalResult.aggregate.pass){
                feedbackPane = <div>
                    <span className="info label"><i className="fi-widget"></i> Awesome!</span>
                    <img src="http://lorempixel.com/200/200/animals" ></img>
                    </div>
            } else {
                let tryAgainMsg = (lastEval.evalResult.attemptsLeft > 0) ? "Let's try again!" : "";
                feedbackPane = <div>
                    <span className="alert label"><i className="fi-x-circle"></i> Incorrect. {tryAgainMsg}</span>
                    <img src="http://lorempixel.com/g/200/200/animals" ></img>
                    </div>
            }
        }


        return (
            <div className="eli-feedback">
                {feedbackPane}
            </div>
        );
    }
}
