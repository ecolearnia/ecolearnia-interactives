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
 *  This file includes references to all interactive components and core dependencies.
 *
 * @author Young Suk Ahn Park
 * @date 5/14/15
 */

var PubSub = require('../libs/common/pubsub').default;
module.exports.PubSub = PubSub;

/**
 * Exposign the Container
 */
var Container = require('./core/container').default;
module.exports.Container = Container;
