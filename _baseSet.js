var assignValue = require('./_assignValue'),
    castPath = require('./_castPath'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject'),
    find = require('./find'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var selector = toKey(path[index]),
        newValue = value;

    if (selector === '__proto__' || selector === 'constructor' || selector === 'prototype') {
      return object;
    }

    if (index === 0 && Array.isArray(nested)) {
      var regexMatchResult = selector.match(/\(([^)]+)\)/);
      var conditionSelector = regexMatchResult && regexMatchResult[1];

      if (conditionSelector && conditionSelector.includes(':')) {
        var [key, val] = conditionSelector.split(':');
        val = isNaN(val) ? val.replace(/["']/g, '') : +val;

        var findResult = find(nested, {[key]: val})

        if (findResult) {
          nested = findResult;
        } else {
          var newObj = {[key]: val};
          nested.push(newObj);
          nested = newObj;
        }

        continue;
      }
    }

    if (index != lastIndex) {
      var objValue = nested[selector];
      newValue = customizer ? customizer(objValue, selector, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, selector, newValue);
    nested = nested[selector];
  }
  return object;
}

module.exports = baseSet;
