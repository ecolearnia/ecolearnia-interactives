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

//import ResourceService from '../../../libs/common/resourceservice';
var ResourceService = require('../../../libs/common/resourceservice').default;

 /**
  * @class ContentResource
  *
  * @module studio
  *
  * @classdesc
  *  Content Resource.
  *
  */
export default class AssignmentProvider
{
    /**
     * @param {object} config
     */
    constructor(config)
    {
        this.assignmentResource_ = new ResourceService(config);
    }

    startAssignment(outsetUuid)
    {
        return this.assignmentResource_.doRequest({method: 'POST'}, null, {outsetNode: outsetUuid});
    }

    getAssignment(assignmentUuid)
    {
        return this.assignmentResource_.get({_id: assignmentUuid});
    }

    /**
     *
     */
    createNextActivity(assignmentUuid)
    {
        return this.assignmentResource_.doRequest({method: 'POST'}, assignmentUuid + '/nextactivity');
    }

    /**
     * Fetch Activity
     */
    fetchActivity(assignmentUuid, activityUuid)
    {
        return this.assignmentResource_.doRequest({method: 'GET'}, assignmentUuid + '/activities/' + activityUuid);
    }

    /**
     * Saves an activity item's state
     * @return {Promise.resolve({string})} On success resolves state id (uuid)
     */
    saveActivityState(assignmentUuid, activityUuid, state, timestamps)
    {
        var opts = {
            method: 'PUT',
            body: JSON.stringify({
                state, timestamps
            })
        };
        return this.assignmentResource_.doRequest(opts, assignmentUuid + '/activities/' + activityUuid + '/state');
    }

    /**
     *
     */
    evalActivity(assignmentUuid, activityUuid, submissionDetails)
    {
        var opts = {
            method: 'POST',
            body: JSON.stringify(submissionDetails)
        };
        return this.assignmentResource_.doRequest(opts, assignmentUuid + '/activities/' + activityUuid + '/eval');
    }
}
