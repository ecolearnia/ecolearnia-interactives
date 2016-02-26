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
                return dispatcher.updateState(componentId, state);
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

}