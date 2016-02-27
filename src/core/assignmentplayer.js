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
 *  This file includes the definition of ItemPlayer class.
 *
 * @author Young Suk Ahn Park
 * @date 5/13/15
 */

var _ = require('lodash');
var React = require('react');
var ReactDOM = require('react-dom');

import utils from '../../libs/common/utils';
import logger from '../../libs/common/logger';
import stringTemplate from '../../libs/contrib/templateengine';
import PubSub from '../../libs/common/pubsub';

import ComponentContext  from '../../src/components/componentcontext';
import StoreFacade       from '../../src/core/storefacade';
import ItemDispatcher    from '../../src/core/itemdispatcher';
import ItemActionFactory from '../../src/core/itemactionfactory';
import itemReducers      from '../../src/core/itemreducers';
import LocalEvaluator    from '../../src/core/localevaluator';

/**
 * @class ItemPlayer
 *
 * @module interactives/core
 *
 * @classdesc
 *  Item Context manages the overall lifecycle and interaction of the
 *  components specified in a content item.
 *  Based on the item specification, it creates the components and renders
 *  them as needed.
 *  Besides the components, it also has the references to the dispatcher.
 *
 *  The object of this class is created using the factory method createItemPlayer().
 *
 * @constructor
 *
 * @param {object} config
 *
 */
export default class AssignmentPlayer
{
    constructor(config)
    {
        /**
         * DOM element to render the assignment item
         */
        this.el_;

        /**
         * The item player instance which manages an item content
         */
        this.itemPlayer_;
    }

    load(el) {
        this.el_ = el;
    }
}
