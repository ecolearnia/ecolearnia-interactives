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
import React from 'react';
import ReactDOM from 'react-dom';
import utils  from '../../../libs/common/utils';
import logger from '../../../libs/common/logger';

import ComponentContext  from './itemcomponentcontext';
import stringTemplate from '../../../libs/contrib/templateengine';


 /**
  * @class ItemPlayer
  *
  * @module interactives/player/item
  *
  * @classdesc
  *  Item Wrapper wraps around the item, which is a content instanted.
  *
  */
 export default class ItemWrapper
 {
     /**
      * @param {object} config
      */
     constructor(config)
     {
        /**
         * The logger
         */
        this.logger_ = logger.getLogger('ItemWrapper');

        /**
         * ID used to retrieve the LearnerAssignmentItem, the content instance
         * with associated user/course.
         * The server uses the retrieved LearnerAssignmentItem to evaluate the
         * submission and append the result (activity).
         * @type {string}
         */
        this.nodeId_;

        /**
         * The content which this context is operating on
         * @type {player.ContentDefinition}
         */
        this.content_;

        /**
         * Map of component id to its specification (description)
         * @type {Map.<string, Component>}
         */
        this.componentSpecs_ = {};

         /**
          * Map of component id to its instance
          * @type {Map.<string, {ref: Component, unsubscribe: function>}
          */
         this.componentReferences_ = {};

         /**
          * Scope in which all the component class definitions are.
          * @type {Object}
          */
         this.componentModule_ = config.componentModule;

         /**
          * @type {StoreFacade}
          */
         this.store_ = config.store;

         /**
          * @type {ItemDispatcher}
          */
         this.dispatcher_ = config.dispatcher;
     }

     /*** Static methods ***/

     /**
      *
      * @param fqn
      * @returns {object}
      *      Format: { domain: <definition|components>, id: (string) }
      */
     static parseFqn(fqn)
     {
         var retval = {};
         if (fqn) {
             if (fqn[0] === '.') {
                 var parts = fqn.split('.');
                 retval.domain = parts[0];
                 retval.id = parts.shift();
             } else {
                 retval.id = fqn;
             }
         }
         return retval;
     }

     /*** Member methods ***/

     /**
      * getStore
      */
     getStore()
     {
         return this.store_;
     }

     /**
      * Gets the node Id (aka assocationId).
      *
      * @param {string} content
      */
     getNodeId()
     {
         return this.nodeId_;
     }

     /**
      * Gets the content.
      *
      * @param {object} content
      */
     getContent()
     {
         return this.content_;
     }

     /**
      * Sets the content.
      * Triggers re-rendering.
      *
      * @todo - Trigger re-rendering
      *
      * @param {string} nodeId - the node ID
      * @param {object} content - the actual content
      */
     setContent(nodeId, content)
     {
         if (this.nodeId_ === nodeId) {
             // Trying to set same content. othing to do.
             return;
         }

         this.nodeId_ = nodeId;
         this.content_ = content;
         this.componentReferences_ = {};

         // Convert component spec from array to Object map for efficient
         // retrieval.
         // the components are already in form of map
         this.componentSpecs_ = (content && content.body) ? content.body.components : null;

         // New content was set, reset the store and trigger render
         // @todo - Check if the content has been rendered, to rigger reset.
         this.store_.reset();
     }

     ////////// item state access {{ //////////

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
         let componentStates = this.store_.getState('components');
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
      * @param {string} value
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

         this.dispatcher_.updateState(componentState);
     }


     /**
      * Casts the field value to appropriated type (either number of string)
      * @param {string} fieldName
      * @return {string, number, boolean}
      */
     castFieldValue(fieldName, val)
     {
         let content = this.getContent();
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

     /**
      * Returns true iff there was no prior submission or (there are more
      * attempts left AND prior attempt was incorrect)
      * @return boolean
      */
     isSubmissionAllowed()
     {
        let lastEval = this.getLastEval();
        let allowSubmission = lastEval ? (!lastEval.evalResult.aggregate.pass
            && lastEval.evalResult.attemptsLeft > 0): true;
        return allowSubmission;
     }

     ////////// }} item state access //////////


     ////////// item construction {{ //////////

     /**
      * renderTemplateString
      *
      * Renders a string with variable placeholders. The variable place holders
      * are replaced by the actual variable values in the content.
      *
      * @param {string} template  - the template string
      */
     renderTemplateString(template)
     {
         if (!this.getContent().variableDeclarations)
         {
             return template;
         }
         let vars = {};
         for(let varName in this.getContent().variableDeclarations)
         {
             vars[varName] = this.getContent().variableDeclarations[varName].value;
         }

         let retval = stringTemplate(template, vars);
         return retval;
     }

     /**
      * getValue
      *
      * If the parameter is a primitive value return it, if the paremeter
      * is an object with reference (_ref) property, which is
      * a fully qualified name (fqn) of a model object or component object
      * return the resolved object.
      *
      * @param {object} param  - the parameter which could be the value itself
      *      or may be an object which contains "_ref" denoting a local fully
      *      qualified name to where the actual value is.
      */
     getValue(param)
     {
         var retval = param;
         // If it contains a local reference, get the object it points to.
         if (param._ref)
         {
             retval = this.resolveObject(param._ref);
         }
         return retval;
     }

     /**
      * resolveObject
      *
      * Returns the model object or component object
      *
      * @param {string} fqn  - the Fully Qualified Name of the object
      */
     resolveObject(fqn)
     {
         var retval;

         if (utils.startsWith(fqn, '.'))
         {
             // if it starts with '.model' returns the model's object,
             if (utils.startsWith(fqn, '.model'))
             {
                 var refPath = fqn.substring('.model.'.length );
                 retval = utils.dotAccess(this.content_.modelDefinition, refPath);
             }
             // if it starts with '.variable' returns the varable's object
             else if (utils.startsWith(fqn, '.variable.'))
             {
                 var refPath = fqn.substring('.variable.'.length );
                 retval = utils.dotAccess(this.content_.variableDeclarations, refPath);
             }

             // if it starts with '.component' returns the Component object\
             else if (utils.startsWith(fqn, '.component.'))
             {
                 var componentId = fqn.substring(11);
                 retval = this.getComponent(componentId);
             }
             else
             {
                 throw new Exception('Wrong object path, must be either .model or .component')
             }
         }
         // Not starts with dot means it is already a component name.
         else
         {
             retval = this.getComponent(fqn);
         }

         return retval;
     }


     /**
      * Builds the components as specified in the spec
      *
      * @param {object} spec  - The specification of the components
      * @param {string} componentId  - id of the component
      *
      * @return {player.Component}  The component instance (a React element)
      */
     createComponent(componentId)
     {
         let spec = this.componentSpecs_[componentId];
         if (!(spec.type in this.componentModule_)) {
             throw new Error('Component ' + spec.type + ' not found in module');
         }
         var componentClass = this.componentModule_[spec.type];

         var componentKind = componentClass.prototype.componentKind();

         var constructorArg = {
             context: new ComponentContext(componentId, this),
             store: this.store_
         };

         var retval = null;
         if (componentKind === 'react') {
             retval = React.createElement(componentClass, constructorArg);
         } else {
             retval = new componentClass(constructorArg);
         }
         this.logger_.info(
             { componentKind: componentKind, type: spec.type, id: componentId},
             'Component created'
         );

         return retval;
     }

     /**
      * getComponent
      *
      * Returns the component instance.
      * Either returns the existing object in the reference table, or creates
      * one, registers it and returns it.
      *
      * @param {string} id - The component Id
      *
      * @return {player.Component} The component instance (a React element)
      */
     getComponent(id) {
         if (!(id in this.componentReferences_)) {
             if (!(id in this.componentSpecs_)) {
                 throw new Error('Component with id:' + id + ' not found');
             }
             this.componentReferences_[id] = {
                 ref: this.createComponent(id)
             }
         }
         return this.componentReferences_[id].ref;
     }

     /**
      * renderComponent
      *
      * Renders the component to specific DOM element
      *
      * @param {string} param  - The component or the component id
      * @param {DOM} el  - DOM element to render the component
      * @return {DOM}  - The el
      */
     renderComponent(param, el)
     {
         // We are assuming that if the param is a string, then it is the
         // component id; otherwise is the component itself;
         var component = param;
         if (typeof param === 'string') {
             component = this.getComponent(param);
             this.componentReferences_[param].el = el;
         }

         // Little hack so I can get the component type from Backbone's view or React.
         // React provides componentKind() method through mixin
         var componentKind = (component.componentKind) ? component.componentKind() : component.type.prototype.componentKind();

         if (componentKind === 'react') {
             ReactDOM.render(component, el);
         } else {
             throw new Error('Only component of kind React is supported');
         }

         return el;
     }

     /**
      * Renders the main (root) component
      */
     renderMainComponent(el)
     {
         if (!this.content_ || !this.content_.body.mainComponent) {
             throw new Error('Main component was not specified');
         }
         let mainComponentEl = this.renderComponent(
             this.content_.body.mainComponent, el);

         return mainComponentEl;
     }

     registerUnsubscriber(componentId, unsubscribe)
     {
        if (!(componentId in this.componentReferences_)) {
            this.logger_.warn('Unexistent componentId for registerUnsubscriber' + componentId);
            return;
        }
        this.logger_.info({ node: this.nodeId_, component: componentId},  'Registering unsubscribe');
        this.componentReferences_[componentId].unsubsribe = unsubscribe;
     }

     ////////// }} item construction //////////

     unmount(el)
     {
         ReactDOM.unmountComponentAtNode(el);
     }

     /**
      * Disposes this object
      */
     dispose()
     {
         for(let componentId in this.componentReferences_)
         {
             // @todo - figure out out to explicitly unsubscribe
             this.logger_.info('Cleaning up ' + componentId);
             //this.componentReferences_[componentId].unsubscribe();
             this.componentReferences_[componentId].ref = null;

             if (this.componentReferences_[componentId].el) {
                 //this.unmount(this.componentReferences_[componentId].el);
             } else {
                 this.logger_.info('Skipping unmountComponentAtNode ' + componentId);
             }
         }
     }
 }
