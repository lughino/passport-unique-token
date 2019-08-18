/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueTokenStrategy } from './strategy';
import { passport } from '../tests';
import { Request } from 'express';

describe('UniqueTokenStrategy', (): void => {
  it('should thrown an error when no verify callback is passed', (): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore ts(2554)
    expect((): void => new UniqueTokenStrategy()).toThrowError(TypeError);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore ts(2554)
    expect((): void => new UniqueTokenStrategy()).toThrowError(
      /token authentication strategy requires a verify function/i,
    );
  });

  it('should expose name prop', (): void => {
    const strategy = new UniqueTokenStrategy((): void => {});
    expect(strategy.name).toBe('token');
  });

  it('should return an error during verification', (done): void => {
    const errorMessage = 'something went wrong';
    const strategy = new UniqueTokenStrategy((_, cb): void => {
      cb(new Error(errorMessage));
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { token: 'sdcoidsho3453oihrviowhv9082*é' };
      })
      .error((err: Error): void => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual(errorMessage);
        done();
      })
      .authenticate();
  });

  it('should return an error during verification', (done): void => {
    const errorMessage = 'something went horribly wrong';
    const strategy = new UniqueTokenStrategy((): void => {
      throw new Error(errorMessage);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { token: 'sdcoidsho3453oihrviowhv9082*é' };
      })
      .error((err: Error): void => {
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toEqual(errorMessage);
        done();
      })
      .authenticate();
  });

  it('should fail the authentication', (done): void => {
    const strategy = new UniqueTokenStrategy((_, cb): void => {
      cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { token: 'sdcoidsho3453oihrviowhv9082*é' };
      })
      .fail((i: any): void => {
        expect(i).toBeUndefined();
        done();
      })
      .authenticate();
  });

  it('should fail the authentication with info', (done): void => {
    const message = 'authentication failed';
    const strategy = new UniqueTokenStrategy((_, cb): void => {
      cb(null, false, { message });
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { token: 'sdcoidsho3453oihrviowhv9082*é' };
      })
      .fail((i: any): void => {
        expect(i.message).toBe(message);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in body using custom field names', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenField: 'uniqToken' }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { uniqtoken: token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in body using custom field names with object notation', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenField: 'uniqToken[unique]' }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { uniqtoken: { unique: token } };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in body using custom field names and `caseSensitive` option enabled', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenField: 'uniqToken', caseSensitive: true }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { uniqToken: token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle with invalid credentials and `caseSensitive` option enabled', (done): void => {
    const strategy = new UniqueTokenStrategy({ tokenField: 'uniqToken', caseSensitive: true }, (): void => {
      throw new Error('should not be called');
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { uniqtoken: 'asdlknakjncwekjn234kjnjn' };
      })
      .fail((info: any, status: number): void => {
        expect(info.message).toBe('Missing credentials');
        expect(status).toBe(400);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in body', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenField: 'uniqToken' }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { uniqtoken: token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in query', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenQuery: 'uniqToken' }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.query = { uniqtoken: token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in params', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenParams: 'uniqToken' }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.params = { uniqtoken: token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle a request with valid credentials in header', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ tokenHeader: 'uniqToken' }, (t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.headers = { uniqtoken: token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });

  it('should handle a request without a body', (done): void => {
    const strategy = new UniqueTokenStrategy((): void => {
      throw new Error('should not be called');
    });
    passport
      .use(strategy)
      .fail((info: any, status: number): void => {
        expect(info.message).toBe('Missing credentials');
        expect(status).toBe(400);
        done();
      })
      .authenticate();
  });

  it('should handle a request without a token', (done): void => {
    const strategy = new UniqueTokenStrategy((): void => {
      throw new Error('should not be called');
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = {};
      })
      .fail((info: any, status: number): void => {
        expect(info.message).toBe('Missing credentials');
        expect(status).toBe(400);
        done();
      })
      .authenticate();
  });

  it('should handle a request without a token with a custom message', (done): void => {
    const badRequestMessage = 'Custom error message';
    const strategy = new UniqueTokenStrategy((): void => {
      throw new Error('should not be called');
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = {};
      })
      .fail((info: any, status: number): void => {
        expect(info.message).toBe(badRequestMessage);
        expect(status).toBe(400);
        done();
      })
      .authenticate({ badRequestMessage });
  });

  it('should handle a request without a token with `failOnMissing` oprion disabled', (done): void => {
    const spy = jest.fn();
    const strategy = new UniqueTokenStrategy({ failOnMissing: false }, (): void => {
      spy();
      throw new Error('should not be called');
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = {};
      })
      .pass((): void => {
        expect(spy).toBeCalledTimes(0);
        done();
      })
      .authenticate();
  });

  it('should pass the express request to the verify callback', (done): void => {
    const token = 'sdvoihweui3498d9vhwoufhi8h';
    const id = '1234-4567-2345-6789';
    const scope = 'read';
    const strategy = new UniqueTokenStrategy({ passReqToCallback: true }, (req, t, cb): void => {
      if (t === token) {
        return cb(null, { id }, { scope });
      }
      return cb(null, false);
    });
    passport
      .use(strategy)
      .req((req: Request): void => {
        req.body = { token };
      })
      .success((user: any, info: any): void => {
        expect(user.id).toBe(id);
        expect(info.scope).toBe(scope);
        done();
      })
      .authenticate();
  });
});
