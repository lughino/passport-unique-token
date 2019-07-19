import { Strategy } from 'passport-strategy';
import express from 'express';
import { lookup } from './utils';

type DoneCallback = (err: Error, user: unknown, info: unknown) => void;
type Verify = (req?: express.Request | string, token?: string | DoneCallback, done?: DoneCallback) => void;
export interface UniqueTokenOptions {
  tokenField?: string;
  tokenQuery?: string;
  tokenParams?: string;
  tokenHeader?: string;
  passReqToCallback?: boolean;
  caseSensitive?: boolean;
  failOnMissing?: boolean;
}
export interface UniqueTokenAuthenticateOptions {
  badRequestMessage?: string;
}

/**
 * `Strategy` class.
 *
 * The token authentication strategy authenticates requests based on the
 * credentials submitted through standard request headers, body, querystring or params.
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
 *   - `failOnMissing`  when `false`, if the token is not found it will not fail (default: `true`)
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
export class UniqueTokenStrategy extends Strategy {
  private defaultToken = 'token';
  private tokenField: string;
  private tokenQuery: string;
  private tokenParams: string;
  private tokenHeader: string;
  private failOnMissing: boolean;
  private passReqToCallback: boolean;
  private verify: Verify;

  public constructor(options: UniqueTokenOptions, verify: Verify) {
    super();
    if (typeof options === 'function') {
      verify = options;
      options = {};
    }
    if (!verify) {
      throw new TypeError('Token authentication strategy requires a verify function');
    }

    this.tokenField = this.sanitizeToken(options, 'tokenField');
    this.tokenQuery = this.sanitizeToken(options, 'tokenQuery');
    this.tokenParams = this.sanitizeToken(options, 'tokenParams');
    this.tokenHeader = this.sanitizeToken(options, 'tokenHeader');
    this.failOnMissing = typeof options.failOnMissing !== 'undefined' ? !!options.failOnMissing : true;
    this.verify = verify;
    this.passReqToCallback = options.passReqToCallback;
  }

  public authenticate(req: express.Request, options: UniqueTokenAuthenticateOptions = {}): void {
    const token =
      lookup(req.body, this.tokenField) ||
      lookup(req.query, this.tokenQuery) ||
      lookup(req.params, this.tokenParams) ||
      lookup(req.headers, this.tokenHeader);

    if (!token) {
      return this.failOnMissing
        ? this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400)
        : this.pass();
    }

    try {
      return this.passReqToCallback
        ? this.verify(req, token, this.verifiedCallback)
        : this.verify(token, this.verifiedCallback);
    } catch (e) {
      return this.error(e);
    }
  }

  private verifiedCallback(err: Error, user: any, info: any): void {
    if (err) {
      return this.error(err);
    }
    if (!user) {
      return this.fail(info);
    }

    return this.success(user, info);
  }

  private sanitizeToken(options: UniqueTokenOptions, optionsField: string): string {
    const token = options[optionsField];
    if (!token) return this.defaultToken;

    return options.caseSensitive ? token : token.toLowerCase();
  }
}
