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
 * @class MultiValueQuestionComponent
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
export class SelectQuestionComponent extends AbstractQuestionComponent
{
    /*
    propTypes: {
        // Component context
        context: React.PropTypes.object.isRequired,
    },*/
    constructor(props)
    {
        super(props);

        this.bind_('handleChange_');
    }

    handleChange_(fieldId, key, event)
    {
        var question = this.props.context.getConfigVal('question');

        let state = {};
        if (event.target.checked) {
            var value = this.getOptionValue(question, fieldId, key);
            state[fieldId] = {
                key: key,
                value: value
            };
        } else {
            state[fieldId] = {};
        }

        this.props.context.dispatcher.updateState(state);
    }

    render()
    {
        // Returns the object either from the config question value itself
        // Or from the reference to the model.
        let question = this.props.context.getConfigVal('question');

        var optionsSet = [];
        // For each of the fields
        question.fields.forEach( function(element, index){

            // For each of the options (distractors) within the field
            var options = element.options.map(function(option) {
                // element.responseId is the response's fieldId
                return (
                    <li className="eli-question-option">
                        <input type="checkbox" name={element.responseId} onChange={this.handleChange_.bind(this, element.responseId, option.key)} value={option.value} />
                        {option.value}
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
            <div className="eli-question">
                <span className="eli-question-prompt">{question.prompt}</span>
                {optionsSet}
            </div>
        );
    }
}
