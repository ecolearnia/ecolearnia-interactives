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
import {EliReactComponent} from '../../../components/elireactcomponent';

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
        // Get the state of report, an Immutable.Map
        let report = this.props.store.getState()['report'].toObject();
        // Convert itemEvalBriefs (an Immutable.OrderedMap) into array
        let itemEvalBriefs = report.itemEvalBriefs.toArray();

        let rows = itemEvalBriefs.map(function(evalBrief, index) {
            let correctnessMark = '-';
            let correctnessClass = '';
            let title = '';
            let secondsSpent = '';
            title = (evalBrief.nodeId) ? evalBrief.nodeId : "";
            secondsSpent = (evalBrief.secondsSpent) ? evalBrief.secondsSpent : "";
            if (evalBrief && evalBrief.aggregateResult) {
                 correctnessMark = (evalBrief.aggregateResult.pass) ? "&#10003;" : "&#10007;";
                 correctnessClass = (evalBrief.aggregateResult.pass) ? "&#10003;" : "&#10007;";
            }

            return (<tr key={index}>
                    <td>{index}</td>
                    <td><span className={correctnessClass}
                            title={title}
                            dangerouslySetInnerHTML={ {__html: correctnessMark} }>
                        </span></td>
                </tr>);
        });
        return (
            <div className="eli-assignmentreport">
                <h3>Summary of your work</h3>
                <table>
                    {rows}
                </table>
            </div>
        );
    }
}
