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
 * @date 5/13/15
 */

var React = require('react');
import EliReactComponent from '../../core/elireactcomponent';

/**
 * @class Breadcrumbs
 *
 * @module interactives/components
 *
 * @classdesc
 *  React based component that represents the breadcrumb
 *
 * @todo - Implement!
 */
export default class Breadcrumbs extends EliReactComponent
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        // @type {[
        //   {title, url, disabled}
        // ]}
        let path = this.props.store.getState()['breadcrumbs'].toArray();

        let items = path.map(function(item, index) {
            let href = item.url;
            return (
                <li key={index}><a href={href}>{item.title}</a></li>
            );
        });

        return (
            <nav aria-label="You are here:" role="navigation">
                <ul className="breadcrumbs">
                {items}
                </ul>
            </nav>
        );
    }
}
