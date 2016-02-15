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
 *  This file includes utility functions.
 *
 * @author Young Suk Ahn Park
 * @date 5/15/15
 */

var _ = require('lodash');
/**
 * endsWith
 * Returns true if the str ends with the suffix, false otherwise.
 *
 * @param {string} str
 * @param {string} suffix
 */
function endsWith (str, suffix)
{
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};
module.exports.endsWith = endsWith;

/**
 * startsWith
 * Returns true if the str starts with the prefix, false otherwise.
 *
 * @param {string} str
 * @param {string} prefix
 * @param {number} position
 */
function startsWith (str, prefix, position)
{
    position = position || 0;
    return str.lastIndexOf(prefix, position) === position;
};
module.exports.startsWith = startsWith;

/**
 * Access an object using dot notation
 * When third parameter is provided, the function behaves as setter, otherwise behaves as getter
 *
 * Sample:
 *   utils.dotAccess(object, 'a.b.c', 'Hello World');
 *   var myval = utils.dotAccess(object, 'a.b.c');
 *   --> myval = 'Hello World'
 * source: http://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
 *
 * @param {object} obj  - The object to be accessed
 * @param {string} is  - The dot notation string
 * @param {*|undefined}  - if provided, this call is a setting call, otherwise getting call
 *
 * @return {*}   - The value
 */
function dotAccess (obj, is, value)
{
    if (typeof is == 'string')
        return dotAccess(obj, is.split('.'), value);
    else if (is.length == 1 && value !==undefined)
        return obj[is[0]] = value;
    else if (is.length == 0)
        return obj;
    else {
        // Create nested property it it is setting mode and path not exists
        if (obj[is[0]] === undefined && value !== undefined) {
            obj[is[0]] = {};
        }
        return dotAccess(obj[is[0]], is.slice(1), value);
    }
};
module.exports.dotAccess = dotAccess;


/**
 * dotPopulate
 */
function dotPopulate(obj, values)
{
    for (var property in values) {
        if (values.hasOwnProperty(property)) {
            dotAccess(obj, property, values[property]);
        }
    }
};

module.exports.dotPopulate = dotPopulate;

/**
 * Converts flat object into nested structure based on dot notation.
 *
 * E.g.
 * {
 *   "foo.bar.baz1": "baz-val1",
 *   "foo.bar.baz2": "baz-val2"
 * }
 * Will return
 * {
 *   "foo": {
 *     "bar": {
 *       "baz1": "baz-val1",
 *       "baz1": "baz-val2"
 *     }
 *   }
 * }
 */
function hydrate (obj)
{
    var hydratedObj = {};
    for (var prop in obj) {
        if (prop.indexOf('.') !== -1) {
            // create nested property
            var val = obj[prop];
            dotAccess(hydratedObj, prop, val);
            //delete obj[prop];
        }
    }
    return hydratedObj;
};

module.exports.hydrate = hydrate;

/**
 * Converts object with nested structure into flat object with one level property.
 * The property names follows the dot notation.
 *
 * Opposite of hydrate operation.
 * @param {object} obj  - the object to traverse and produce dehydrated
 *                        (flattened) object.
 * @param {string} pathPrefix - the prefix (dot notation) for the property names
 * @param {string} dotChar    - the character for the dot (separator) by default
 *                              is '.'
 */
function dehydrate(obj, pathPrefix, dotChar)
{
    dotChar = dotChar || '.';
    let dehydratedObj = {};
    let path = pathPrefix ? pathPrefix + dotChar : '';
    for (var prop in obj) {
        if (_.isPlainObject(obj[prop])) {
            dehydratedObj = _.assignIn(dehydratedObj, dehydrate(obj[prop], path + prop, dotChar));
        } else {
            dehydratedObj[path + prop] = obj[prop];
        }
    }
    return dehydratedObj;
};


module.exports.dehydrate = dehydrate;
