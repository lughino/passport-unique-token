/**
 * Created by Luca Pau on 29/05/14.
 */

exports.lookup = function(obj, field) {
  if (!obj) {
    return null;
  }
  var chain = field.split(']').join('').split('[');
  for (var i = 0, x; x = chain[i]; ++i) {
    var prop = obj[x];
    if (typeof(prop) === 'undefined') {
      return null;
    }
    if (typeof(prop) !== 'object') {
      return prop;
    }
    obj = prop;
  }
  return null;
};