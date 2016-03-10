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
 *  This file includes the definition of MultiValueQuestionComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */
var React = require('react');
var AbstractQuestionComponent = require('./question.jsx').AbstractQuestionComponent;

/**
 * @class TextFieldQuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based component that represents a generic multiValue question.
 *  A TextField question are those which the question can ask for multiple
 *  values.
 *  Therefore the submission has the structure of
 *  Object.<key: string, value: Object>
 *
 */
export class TextFieldQuestionComponent extends AbstractQuestionComponent
{
    constructor(props)
    {
        super(props);

        this.bind_('handleBlur_');
        
    }

    /**
     * React lifecycle.
     * Invoked immediately after the component's updates are flushed to the DOM.
     * This method is not called for the initial render.
     * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
     */
    componentDidUpdate(prevProps, prevState)
    {
        // Set the value with the restored state
        let question = this.props.context.getConfigVal('question');
        for (var i=0; i < question.fields.length; i++) {
            let element = question.fields[i];
            let fieldState = this.props.context.getFieldState(element.responseId);
            let fieldVal = fieldState ? fieldState.value : '';
            this.inputs_[element.responseId].value = fieldVal;
        }
    }

    /**
     * Handle blur: update Item state
     * @param {string} fieldName - the fieldName
     * @param {DOMEvent} event - the DOM's event
     */
    handleBlur_(fieldName, event)
    {
        this.props.context.setFieldValue(fieldName, event.target.value);
    }

    render()
    {
        // Returns the object either from the config question value itself
        // Or from the reference to the model.
        let question = this.props.context.getConfigVal('question');

        // Obtain the last eval state
        let evalsState = this.props.store.getState('evaluations');
        let lastEval = (evalsState && evalsState.length > 0) ? evalsState[evalsState.length-1] : null;

        var fieldList = [];
        // For each of the fields
        question.fields.forEach( function(element, index) {

            // fill state is available
            // the field state
            let fieldState = this.props.context.getFieldState(element.responseId);
            let fieldVal = fieldState ? fieldState.value : undefined;
            //let temp = this.state[element.responseId];

            let optionLabel = '';
            let isCorrect = false;
            if (lastEval) {
                if (lastEval.submission.fields[element.responseId] ) {
                    isCorrect = (lastEval && lastEval.evalResult[element.responseId].score == 1);
                    optionLabel = (isCorrect) ? 'Correct' : 'Wrong!!';
                }
            }
            var labelStyle = {
                color: isCorrect ? 'green': 'red'
            };

            fieldList.push(
                <div>
                    <input type="text" name={element.responseId}
                        ref={(c) => this.inputs_[element.responseId] = c}
                        onBlur={this.handleBlur_.bind(this, element.responseId)}
                     />
                    <span style={labelStyle}> {optionLabel}</span>
                </div>);
        }.bind(this));

        // The "eli" prefix in the className stands for EcoLearnia Interactive
        var prompt = this.props.context.itemPlayer.renderTemplateString(question.prompt);
        return (
            <div className="eli-question">
                <span className="eli-question-prompt">{prompt}</span>
                {fieldList}
            </div>
        );
    }
}
