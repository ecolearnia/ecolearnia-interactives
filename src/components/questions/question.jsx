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
 *  This file includes the definition of MultiValueQuestionComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */
var React = require('react');
var EliReactComponent = require('../elireactcomponent').EliReactComponent;
var Events = require('../../core/events').Events;

/**
 * @class QuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  React based abstract component that represents a question.
 *  A question has one or more input fields where user can enter answer.
 *  Input fields can be of any type, e.g. textbox, slider, dropdown, etc.
 *
 *
 * @todo - Submission handling: keep the state in models
 * @todo - Factor out the presenter: multiselect, multichoice, etc.
 */
export class AbstractQuestionComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
        this.bind_('handleEvaluatedEvent_');

        /*
        this.props.itemContext.pubsub.subscribe(
            Events.ANSWER_EVALUATED,
            this.handleEvaluatedEvent_.bind(this)
        );*/

        /**
         * References used for state restoration
         * All inputs generated in the derived components should include
         * ref={(c) => this.inputs_[element.responseId] = c}
         * for proper initialization.
         *
         * @type{Object.<DOM>}
         */
        this.inputs_ = {};
    }

    handleEvaluatedEvent_(message)
    {
        if(message.source.itemId === this.props.context.getAssociationId())
        {
            // do something
        }
    }

    /**
     * Returns the option's value of a chosen field
     * Applicable for those inputs that has keys
     * @param question
     * @param fieldId
     * @param key
     * @returns {*}
     */
    getOptionValue(question, fieldId, key)
    {
        var field = question.fields.find( function(element, index) {
            return (element.responseId === fieldId);
        });
        if (!field) {
            return null;
        }
        var option = field.options.find( function(element, index) {
            return (element.key === key);
        });
        return option.value;
    }

    /**
     * Restores values by populating input's values
     */
    restoreInputValues()
    {
        // Set the value with the restored state
        let question = this.props.context.getConfigVal('question');
        for (var i=0; i < question.fields.length; i++) {
            let element = question.fields[i];
            let fieldState = this.props.context.getFieldState(element.responseId);
            let fieldVal = (fieldState && fieldState.value !== undefined) ? fieldState.value : '';
            this.inputs_[element.responseId].value = fieldVal;
        }
    }

    /**
     * Add correct/incorrect class to the input elements based on the evaluation
     */
    markCorrectnessToInputs()
    {
        let lastEval = this.props.context.getLastEval();

        let question = this.props.context.getConfigVal('question');
        if (!lastEval) {
            // Has not been evaluated yet, remove all classes
            for (var i=0; i < question.fields.length; i++) {
                let fieldRef = question.fields[i];
                this.inputs_[fieldRef.responseId].classList.remove('correct', 'incorrect');
            }
            return;
        }

        // Set class accordingly
        for (var i=0; i < question.fields.length; i++) {
            let fieldRef = question.fields[i];
            let fieldEval = lastEval.evalResult.fields[fieldRef.responseId];

            let toAdd = 'correct';
            let toRemove = 'incorrect';
            if (!fieldEval.pass) {
                toAdd = 'incorrect';
                toRemove = 'correct';
            }
            this.inputs_[fieldRef.responseId].classList.add(toAdd);
            this.inputs_[fieldRef.responseId].classList.remove(toRemove);
        }
    }

}
