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
import AbstractQuestionComponent from './abstractquestion.jsx';

/**
 * @class SelectQuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based component that represents a generic multiValue question.
 *  A multivalue quesions are those which the question can ask for multiple
 *  values.
 *  Therefore the submission has the structure of
 *  Object.<key: string, value: Object>
 *
 * @todo - Submission handling: keep the state in models
 * @todo - Factor out the presenter: multiselect, multichoice, etc.
 */
export default class SelectQuestionComponent extends AbstractQuestionComponent
{
    constructor(props)
    {
        super(props);

        this.bind_('handleChange_');
    }

    /**
     * Handle click
     */
    handleChange_(fieldId, key, event)
    {
        var question = this.props.context.getConfigVal('question');

        let componentState = {};
        if (event.target.checked) {
            var value = this.getOptionValue(question, fieldId, key);
            componentState[fieldId] = {
                key: key,
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

        var optionsSet = [];
        // For each of the fields
        question.fields.forEach( function(element, index){

            // For each of the options (distractors) within the field
            var options = element.options.map(function(option) {
                // element.responseId is the response's fieldId

                // @todo - find out if the current option was selected
                let optionLabel = '';
                let isCorrect = false;
                if (lastEval) {
                    // if field exists, and submission key is same as current option key
                    if (lastEval.submission.fields[element.responseId] && lastEval.submission.fields[element.responseId].key == option.key) {
                        isCorrect = (lastEval && lastEval.evalResult.fields[element.responseId].score == 1);
                        optionLabel = (isCorrect) ? 'Correct' : 'Wrong!!';
                    }
                }

                var labelStyle = {
                    color: isCorrect ? 'green': 'red'
                };

                return (
                    <li className="eli-question-option">
                        <input type="radio" name={element.responseId}
                            ref={(c) => this.inputs_[element.responseId] = c}
                            onChange={this.handleChange_.bind(this, element.responseId, option.key)} value={option.value} />
                        {option.value}
                        <span style={labelStyle}> {optionLabel}</span>
                    </li>
                )
            }.bind(this));
            optionsSet.push(
                <ul>
                    {options}
                </ul>);
        }.bind(this));



        // The "eli" prefix in the className stands for EcoLearnia Interactive

        return (
            <div className="eli-select">
                <span className="eli-question-prompt">{question.prompt}</span>
                {optionsSet}
            </div>
        );
    }
}
