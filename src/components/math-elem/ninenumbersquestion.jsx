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

var utils = require('../../../libs/common/utils');

var React = require('react');
import AbstractQuestionComponent from '../assessment-common/abstractquestion.jsx';

/**
 * @class TextFieldQuestionComponent
 *
 * @module interactives/components/questions
 *
 * @classdesc
 *  Question component that the student must find 2 unknown nubmers in a
 *  9 numbered table
 *  A | A |sum
 * ---+---+---
 *  B | C |sum
 * ---+---+---
 * sum|sum|total_sum
 *
 */
export default class NineNumbersQuestionComponent extends AbstractQuestionComponent
{
    constructor(props)
    {
        super(props);

        this.bind_('handleBlur_');

    }

    /***** React methods *****/
    componentDidMount()
    {
        super.componentDidMount();

        // following methods are from super class
        super.restoreInputValues();
        super.markCorrectnessToInputs();
    }

    /**
     * React lifecycle.
     * Invoked immediately after the component's updates are flushed to the DOM.
     * This method is not called for the initial render.
     * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
     */
    componentDidUpdate(prevProps, prevState)
    {
        // following methods are from super class
        super.restoreInputValues();
        super.markCorrectnessToInputs();
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
        let self = this;
        // Returns the object either from the config question value itself
        // Or from the reference to the model.
        let question = this.props.context.getConfigVal('question');

        // Obtain the last eval state
        //let evalsState = this.props.store.getState('evaluations');
        //let lastEval = (evalsState && evalsState.length > 0) ? evalsState[evalsState.length-1] : null;


        let matrixData = [];
        for(let i=0; i < 2; i++) {
            let cols = [0, 0];
            matrixData.push(cols);
        }

        let matrixCells = [];
        for(let i=0; i < 3; i++) {
            let cols = ['', '', ''];
            matrixCells.push(cols);
        }

        let patternIndex = this.props.context.item.resolveObject('.variable.patternIndex.value');
        // Shuffle the positions to place the fields
        var fieldPositions = [
            [0,0], [0,1], [1,0], [1,1]
        ];
        let permutations = utils.permutate(fieldPositions);
        fieldPositions = permutations[patternIndex];

        let nums = [];
        nums.push( this.props.context.item.resolveObject('.variable.num1.value') );
        nums.push( nums[0] );
        nums.push( this.props.context.item.resolveObject('.variable.num2.value') );
        let num3 = this.props.context.item.resolveObject('.variable.num3.value');


        // The loop goes through fields-1 because last one is summation
        // Hence it leaves a cell which is used to fill with the number given
        var pos;
        for (let fidx = 0; fidx < question.fields.length - 1; fidx++) {
            pos = fieldPositions.pop();
            let element = question.fields[fidx];

            let style = {
                backgroundColor: fidx == 2 ?  'LightSalmon' : 'LightSkyBlue'
            };
            // nums[fidx] is the actual answer
            matrixData[pos[0]][pos[1]] = nums[fidx];
            matrixCells[pos[0]][pos[1]] = <input type="text"
                // title={nums[fidx]}
                name={element.responseId} style={style}
                ref={(c) => this.inputs_[element.responseId] = c}
                onBlur={this.handleBlur_.bind(this, element.responseId)}
                placeholder={element.responseId}
                className={self.classNameFor('cell.numeric')}
            />
        };
        pos = fieldPositions.pop();
        matrixCells[pos[0]][pos[1]] = num3;
        matrixData[pos[0]][pos[1]] = num3;


        let sumRows = function(arr, rowNum) {
            return arr[rowNum].reduce(function(previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
        }
        let sumCols = function(arr, colNum) {
            let sum = 0;
            for (let row = 0; row < arr.length; row++) {
                sum += arr[row][colNum];
            }
            return sum;
        }
        matrixCells[0][2] = sumRows(matrixData, 0);
        matrixCells[1][2] = sumRows(matrixData, 1);
        matrixCells[2][0] = sumCols(matrixData, 0);
        matrixCells[2][1] = sumCols(matrixData, 1);
        let totalSum = sumRows(matrixCells, 2);

        let lastField = question.fields[question.fields.length-1];
        matrixCells[2][2] = <input type="text"
            // title={totalSum}
            name={lastField.responseId}
            ref={(c) => this.inputs_[lastField.responseId] = c}
            onBlur={this.handleBlur_.bind(this, lastField.responseId)}
            placeholder={lastField.responseId}
            className={self.classNameFor('cell.numeric')}
        />

        // Calculate the sums

        let trStyle = {
            width: '200px',
        }
        // @see http://www.phpied.com/reactive-table/
        let matrix = (
            <table style={trStyle} >
              <tbody>
                {matrixCells.map(function(row, i) {
                  return (
                    <tr key={i} >
                      {row.map(function(col, j) {
                        return <td className={self.classNameFor('cell.numeric')} key={j} border="1">{col}</td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>);


        // The "eli" prefix in the className stands for EcoLearnia Interactive
        var prompt = this.props.context.item.renderTemplateString(question.prompt);
        return (
            <div className="eli-ninenumbers">
                <span className="eli-question-prompt">{prompt}</span>
                {matrix}
            </div>
        );
    }

}
