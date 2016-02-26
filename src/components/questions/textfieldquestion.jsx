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

        this.bind_('handleChange_');
    }

    /**
     * Handle click
     */
    handleChange_(fieldId, event)
    {
        let value = this.props.context.castFieldValue(fieldId, event.target.value);

        let componentState = {};
        if (event.target.value) {
            componentState[fieldId] = {
                value: value
            };
        } else {
            componentState[fieldId] = {};
        }

        this.props.context.dispatcher.updateState(componentState);
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
        question.fields.forEach( function(element, index){

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
                    <input type="text" name={element.responseId} onChange={this.handleChange_.bind(this, element.responseId)} />
                    <span style={labelStyle}> {optionLabel}</span>
                </div>);
        }.bind(this));

        // The "eli" prefix in the className stands for EcoLearnia Interactive

        return (
            <div className="eli-question">
                <span className="eli-question-prompt">{question.prompt}</span>
                {fieldList}
            </div>
        );
    }
}
