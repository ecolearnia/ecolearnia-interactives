/*
 * This file is part of the EcoLearnia platform.
 *
 * (c) Young Suk Ahn Park <ys.ahnpark@mathnia.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * EcoLearnia v0.0.2
 *
 * @fileoverview
 *  This file includes the definition of AnswerModel class.
 *
 * @author Young Suk Ahn Park
 * @date 2/20/16
 */

import utils from '../../../libs/common/utils';

/**
 * @class ComponentContext
 *
 * @module interactives/components
 *
 * @classdesc
 *  ComponentContext object includes references to the content and provides
 * methods that faciliates access
 *
 */
export default class ComponentContext
{
    constructor(componentId, item)
    {
        /**
         * The item player
         */
        this.item = item;

        // The ID of the component
        this.componentId_ = componentId;

        // The component specification (the JSON part of the component)
        this.componentSpec_ = this.item.getContent().body.components[this.componentId_];

        // For closure
        var dispatcher = this.item.dispatcher_;
        let nodeId = this.item.getNodeId();
        this.nodeId_ = nodeId;
        this.dispatcher = {

            /**
             * updates state of a component
             */
            updateState: function (state)
            {
                return dispatcher.updateState(nodeId, componentId, state);
            },

            evaluate: function ()
            {
                return dispatcher.evaluate(nodeId);
            },

            appendMessage: function (message)
            {
                return dispatcher.appendMessage(message);
            }
        };
    }

    /**
     * Return the componentId
     */
    getComponentId()
    {
        return this.componentId_;
    }

    /**
     * Return the componentId
     */
    getNodeId()
    {
        return this.nodeId_;
    }

    ///////// @todo - all the implementation were copied over to itemwrapper

    /**
     * Add field answers to staging.
     *
     * The answeredKey is applicable for inputs which has association key,
     * E.g. select.
     *
     * @param {string} fieldName    - the config property field name in dot notation
     * @param {Object} defaultVal   - the key that student answered.
     */
    getConfigVal(fieldName, defaultVal)
    {
        var configVal = utils.dotAccess(this.componentSpec_.config, fieldName);
        configVal = configVal || defaultVal;
        return this.item.getValue(configVal);
    }

    /**
     * Add field answers to staging.
     *
     * The answeredKey is applicable for inputs which has association key,
     * E.g. select.
     *
     * @param {string} fieldName    - the config property field name in dot notation
     * @param {Object} defaultVal   - the key that student answered.
     */
    getFieldState(fieldName)
    {
        let componentStates = this.item.getStore().getState('components');
        let componentFields = componentStates ? componentStates['fields']: undefined;
        let fieldState = componentFields ? componentFields[fieldName] : undefined;
        return fieldState;
    }

    /**
     * return the field's key
     * @param {string} fieldName    - the config property field name in dot notation
     */
    getFieldKey(fieldName)
    {
        let fieldState = this.getFieldState(fieldName);
        return  fieldState ? fieldState.key : undefined;
    }

    /**
     * return the field's value
     * @param {string} fieldName    - the config property field name in dot notation
     */
    getFieldValue(fieldName)
    {
        let fieldState = this.getFieldState(fieldName);
        return  fieldState ? fieldState.value : undefined;
    }

    /**
     * Set's an DOM input's value
     *
     * @param {string} fieldName
     * @param {string | number | boolean} value
     */
    setFieldValue(fieldName, strValue)
    {
        let value = this.castFieldValue(fieldName, strValue);

        // Skip state update if the value has not changed
        let prevVal = this.getFieldValue(fieldName);
        if (prevVal === value) {
            return;
        }

        let componentState = {};
        if (value !== undefined) {
            componentState[fieldName] = {
                value: value
            };
        } else {
            componentState[fieldName] = {};
        }

        this.dispatcher.updateState(componentState);
    }


    /**
     * Casts the field value to appropriated type (either number of string)
     */
    castFieldValue(fieldName, val)
    {
        let content = this.item.getContent();
        let fieldDecl = content.responseDeclarations[fieldName];
        let fieldType = (fieldDecl && fieldDecl.baseType) ? fieldDecl.baseType.toLowerCase() : 'string';
        if (typeof val === fieldType) {
            return val;
        }
        else if (fieldType === 'number') {
            if (isNaN(val) || val.trim().length == 0) {
                return undefined;
            }
            return Number(val);
        }
        else if (fieldType === 'boolean') {
            return (val.toLowerCase() === 'true');
        }
        return val;
    }

    /**
     * Returns the last evaluation details in the state
     * @return {player.EvalDetails}
     */
    getLastEval() {
        let evalsState = this.item.getStore().getState('evaluations');
        return (evalsState && evalsState.length > 0) ? evalsState[evalsState.length-1] : null;
    }
}
