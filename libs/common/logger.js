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
 *  This file includes logger class.
 *
 *
 * @author Young Suk Ahn Park
 * @date 6/02/15
 */

var internals = {};

internals.logRegistry = {};

internals.console = (global.console || {});

// From http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!internals.console[method]) {
            internals.console[method] = noop;
        }
    }
}());

internals.level = {
    'trace': 10,
    'debug': 20,
    'info': 30,
    'warn': 40,
    'error': 50,
    'fatal': 60
};

/**
 * @class Log
 *
 * @module common
 *
 * @classdesc
 *  Log class that handles the logging.
 *  Currently it is a thin wrapper around the windows.console
 *
 * @param {string} name - the log name
 * @param {number} level - the level to which
 */
internals.Log = function(name, level) {
    this.name_ = name;
    this.levelThreshold_ = level || internals.level.info;
};

/**
 * Logs to specified level
 *
 * @param {number} level - the log level
 * @param {...} args  - the information to log
 *   <object>, [<string-message>, <args>]
 */
internals.Log.prototype.log = function(level /* log parts */)
{
    if (arguments.length < 2)
    {
        return;
    }

    if (typeof level === 'string')
    {
        level = internals.level[level];
    }

    if (level < this.levelThreshold_)
    {
        return;
    }

    var logParts = ['"name":"' + this.name_ + '"'];
    logParts.push('"level":' + level);

    var argsStart = 1;
    if (typeof arguments[argsStart] === 'object') {
        // @todo - flattend first level properties
        logParts.push('"meta":' + JSON.stringify(arguments[argsStart]));
        argsStart = 2;
    }

    // Build message (string)
    var message = [];
    for (var argIdx = argsStart; argIdx < arguments.length; argIdx++) {
        if (typeof arguments[argIdx] === 'object') {
            // @todo - flattend first level properties
            message.push(JSON.stringify(arguments[argIdx]).replace(/"/g, '\\"'));
        } else if (typeof arguments[argIdx] === 'string') {
            message.push(arguments[argIdx]);
        }
    }
    if (message.length > 0) {
        logParts.push ('"message": "' + message.join(' ') + '"');
    }

    var logText = '{' + logParts.join(', ') + '}';
    switch (level) {
        case 10:
            console.log(logText);
            break;
        case 20:
            console.log(logText);
            break;
        case 30:
            console.info(logText);
            break;
        case 40:
            console.warn(logText);
            break;
        case 50:
            console.error(logText);
            break;
        case 60:
            console.error(logText);
            break;
        default:
            console.log(logText);
    }
};

/**
 * Trace log
 */
internals.Log.prototype.trace = function(params) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.trace);
    this.log.apply(this, arguments);
};

/**
 * Debug log
 */
internals.Log.prototype.debug = function(params) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.debug);
    this.log.apply(this, args);
};

/**
 * Info log
 */
internals.Log.prototype.info = function(params) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.info);
    this.log.apply(this, args);
};

/**
 * Warn log
 */
internals.Log.prototype.warn = function(params) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.warn);
    this.log.apply(this, args);
};

/**
 * Error log
 */
internals.Log.prototype.error = function(params) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.error);
    this.log.apply(this, args);
};

/**
 * fatal
 * @param args
 */
internals.Log.prototype.fatal = function(params) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(internals.level.fatal);
    this.log.apply(this, args);
};

/**
 * Logger factory function
 *
 * @param {string} name - The logger of given name
 * @returns {Log}
 */
internals.getLogger = function(name)
{
    if ( !(name in internals.logRegistry))
    {
        internals.logRegistry[name] = new internals.Log(name);
    }
    return internals.logRegistry[name];
};

module.exports.getLogger = internals.getLogger;
