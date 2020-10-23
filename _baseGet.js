var castPath = require('./_castPath'),
    toKey = require('./_toKey'),
    find = require('./find');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    var selector = path[index++];
    var regexMatchResult = typeof selector === 'string' && selector.match(/\(([^)]+)\)/);
    var conditionSelector = regexMatchResult && regexMatchResult[1];

    if (conditionSelector && conditionSelector.includes(':')) {
      var [pathSelector] = selector.split('(');
      var [key, value] = conditionSelector.split(':');
      value = isNaN(value) ? value.replace(/["']/g, '') : +value;

      if (Array.isArray(object)) {
        if (pathSelector.length === 0) {
          object = find(object, {[key]: value});
        } else {
          object = find(object, {[pathSelector]: {[key]: value}});
          object = object && object[pathSelector];
        }
      } else {
        object = object[pathSelector] && find(object, {[key]: value});
      }
    } else {
      object = object[toKey(selector)];
    }
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;
