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
export default class ScoreBoardComponent extends EliReactComponent
{
    constructor(props)
    {
        super(props);
        //this.bind_('handleEvaluatedEvent_');
    }

    render()
    {
        // The "eli" prefix in the className stands for EcoLearnia Interactive
        let stats = this.props.store.getState('stats');
        stats.corrects = stats.corrects || 0;
        stats.incorrects = stats.incorrects || 0;
        stats.semicorrects = stats.semicorrects || 0;

        //let statsDump = JSON.stringify(stats);

        return (
            <div className="eli-scoreboard">
                <table>
                    <tr><td><strong>Score</strong></td><td>{stats.score}</td></tr>
                    <tr><td>Corrects</td><td>{stats.corrects}</td></tr>
                    <tr><td>Incorrects</td><td>{stats.incorrects}</td></tr>
                    <tr><td>Partial</td><td>{stats.semicorrects}</td></tr>
                </table>
            </div>
        );
    }
}
