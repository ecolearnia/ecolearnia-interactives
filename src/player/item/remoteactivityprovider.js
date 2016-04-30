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
 *  This file includes the definition of RemoteActivityProvider class.
 *
 * @author Young Suk Ahn Park
 * @date 3/04/2016
 */

import ResourceService from '../../../libs/common/resourceservice';

/**
 * @class RemoteActivityProvider
 *
 * @module interactives/player/item
 *
 * @classdesc
 *  RemoteActivityProvider provides interface for CRUD operation of the Activity
 *
 */
export default class RemoteActivityProvider
{
    /**
     * @param {object} config
     */
    constructor(config)
    {
        this.assignmentResource = new ResourceService(config);
    }

    /**
     * Fetches a activity
     * @param {string} id  - the activity id to fetch
     * @return {Promise.resolve({player.ActivityDetails})} On success resolves
     *         activity details
     */
    fetch(assignmentUuid, activityUuid)
    {
        return this.assignmentResource.doRequest({method: 'GET'}, assignmentUuid + '/activity/' + activityUuid);
    }

    /**
     * Saves an activity item's state
     * @return {Promise.resolve({string})} On success resolves state id (uuid)
     */
    saveState(assignmentUuid, activityUuid, state, timestamps)
    {
        var requestyBody = {
            state, timestamps
        };
        return this.assignmentResource.doRequest({method: 'PUT', body: requestyBody}, assignmentUuid + '/activity/' + activityUuid + '/state');
    }
 }
