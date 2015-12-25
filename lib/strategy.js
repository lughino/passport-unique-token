/**
 * Module dependencies.
 */
var passport = require('passport-strategy'),
  util = require('util'),
  lookup = require('./utils').lookup;

/**
 * `Strategy` constructor.
 *
 * The token authentication strategy authenticates requests based on the
 * credentials submitted through standard request headers or body.
 *
 * Applications must supply a `verify` callback which accepts
 * unique `token` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *
 *   - `tokenField`  field name where the token is found, defaults to 'token'
 *   - `tokenQuery`  query string name where the token is found, defaults to 'token'
 *   - `tokenParams`  params name where the token is found, defaults to 'token'
 *   - `tokenHeader`  header name where the token is found, defaults to 'token'
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new UniqueTokenStrategy(
 *       function(token, done) {
 *         User.findOne({ token: token }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }

  if (!verify) {
    throw new TypeError('Token authentication strategy requires a verify function');
  }

  this._tokenField = options.tokenField ? options.tokenField.toLowerCase() : 'token';

  this._tokenQuery = options.tokenQuery ? options.tokenQuery.toLowerCase() : this._tokenField;

  this._tokenParams = options.tokenParams ? options.tokenParams.toLowerCase() : this._tokenField;

  this._tokenHeader = options.tokenHeader ? options.tokenHeader.toLowerCase() : this._tokenField;

  this._failOnMissing = options.failedOnMissing !== undefined ? !!options.failedOnMissing : true;

  passport.Strategy.call(this);
  this.name = 'token';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var self = this;
  var token = lookup(req.body, this._tokenField) || lookup(req.query, this._tokenQuery) || lookup(req.params, this._tokenParams) || lookup(req.headers, this._tokenHeader);
  if (!token) {
    if (this._failOnMissing) {
      return this.fail({message: options.badRequestMessage || 'Missing credentials'}, 400);
    } else {
      return this.pass();
    }

  }

  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  try {
    if (self._passReqToCallback) {
      this._verify(req, token, verified);
    } else {
      this._verify(token, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
