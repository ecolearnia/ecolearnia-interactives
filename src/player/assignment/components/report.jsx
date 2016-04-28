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
 *  This file includes the definition of FeedbackComponent class.
 *
 * @author Young Suk Ahn Park
 * @date 3/8/16
 */

import React from 'react';
import EliReactComponent from '../../../core/elireactcomponent';

/**
 * @class ScoreBoard
 *
 * @module player/components
 *
 * @classdesc
 *  Presentation component that displays the scores and stats.
 *
 * @todo - Implement!
 */
export default class ReportComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
        //this.bind_('handleEvaluatedEvent_');
    }

    render()
    {
        let self = this;
        // Get the state of report, an Immutable.Map
        let report = this.props.store.getState()['report'].toObject();
        // Convert itemEvalBriefs (an Immutable.OrderedMap) into array
        let itemEvalBriefs = report.itemEvalBriefs.toArray();

        let secondsSpentSigma = 0;
        let rows = itemEvalBriefs.map(function(evalBrief, index) {
            let correctnessMark = '-';
            let correctnessClass = '';
            let title = '';
            let secondsSpent = '';

            title = (evalBrief.activityId) ? evalBrief.activityId : "";
            secondsSpent = (evalBrief.secondsSpent) ? evalBrief.secondsSpent : "0";
            if (evalBrief && evalBrief.aggregateResult) {
                 correctnessMark = (evalBrief.aggregateResult.pass) ? "&#10003;" : "&#10007;";
                 correctnessClass = (evalBrief.aggregateResult.pass) ? "&#10003;" : "&#10007;";
            }

            if (evalBrief.secondsSpent) {
                secondsSpentSigma += evalBrief.secondsSpent
            }
            return (<tr key={index}>
                    <td>{index}</td>
                    <td><span className={correctnessClass}
                            title={title}
                            dangerouslySetInnerHTML={ {__html: correctnessMark} }>
                        </span></td>
                    <td className={self.classNameFor('cell.numeric')}>{secondsSpent} secs</td>
                    <td className={self.classNameFor('cell.numeric')}>{evalBrief.attemptNum}</td>
                </tr>);
        });
        return (
            <div className="eli-assignmentreport">
                <h3>Summary of your work</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th></th>
                            <th className={self.classNameFor('cell.numeric')}>{secondsSpentSigma} spent</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>Total</td>
                        <td></td>
                        <td>{secondsSpentSigma} secs</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}
