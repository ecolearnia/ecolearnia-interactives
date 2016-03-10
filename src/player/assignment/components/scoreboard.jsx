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
import EliReactComponent from './elireactcomponent').EliReactComponent;

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
export class FeedbackComponent extends React.Component
{
    constructor(props)
    {
        super(props);
        /this.bind_('handleEvaluatedEvent_');

    }

    render()
    {
        // The "eli" prefix in the className stands for EcoLearnia Interactive
        let score = this.props.store.getState('score');

        return (
            <div className="eli-feedback">
                {evalDump}
            </div>
        );
    }
}
