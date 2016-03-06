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

var _ = require('lodash');
import utils from '../../libs/common/utils';

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
    constructor(componentId, itemPlayer)
    {
        /**
         * The item player
         */
        this.itemPlayer = itemPlayer;

        // The ID of the component
        this.componentId_ = componentId;

        // The component specification (the JSON part of the component)
        this.componentSpec_ = this.itemPlayer.getContent().item.components[this.componentId_];

        // For closure
        var dispatcher = this.itemPlayer.dispatcher_;
        var associationId =  this.itemPlayer.getAssociationId();
        this.dispatcher = {

            /**
             * updates state of a component
             */
            updateState: function (state)
            {
                return dispatcher.updateState(associationId, componentId, state);
            },

            evaluate: function ()
            {
                return dispatcher.evaluate(associationId);
            },

            appendMessage: function (message)
            {
                return dispatcher.appendMessage(message);
            }
        }
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
    getConfigVal(fieldName, defaultVal)
    {
        var configVal = utils.dotAccess(this.componentSpec_.config, fieldName);
        configVal = configVal || defaultVal;
        return this.itemPlayer.getValue(configVal);
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
        let componentStates = this.itemPlayer.getStore().getState('components');
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
     * Casts the field value to appropriated type (either number of string)
     */
    castFieldValue(fieldName, val)
    {
        let content = this.itemPlayer.getContent();
        let fieldDecl = content.responseDeclarations[fieldName];
        let fieldType = (fieldDecl && fieldDecl.baseType) ? fieldDecl.baseType.toLowerCase() : 'string';
        if (typeof val === fieldType) {
            return val;
        }
        else if (fieldType === 'number') {
            return Number(val);
        }
        else if (fieldType === 'boolean') {
            return (val.toLowerCase() === 'true');
        }
        return val;
    }

}
