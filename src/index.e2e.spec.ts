import express, { NextFunction, Request, Response, Express } from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import request from 'supertest';
import { UniqueTokenStrategy } from '.';

describe('UniqueTokenStrategy E2E test', (): void => {
  let app: Express;
  beforeEach((): void => {
    app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
  });

  afterEach((): void => {
    passport.unuse('uniqueToken');
  });

  it('should execute it properly with the header', async (): Promise<void> => {
    const token = '1234-43636-2342-12414-1234235';
    const user = { id: '123-456', name: 'test' };
    passport.use(
      'uniqueToken',
      new UniqueTokenStrategy(
        { tokenHeader: 'uniqueToken', passReqToCallback: true },
        (req, uniqueToken, done): void => {
          expect(uniqueToken).toBe(token);
          done(null, user);
        },
      ),
    );
    app.get('/post', (req: Request, res: Response, next: NextFunction): void =>
      passport.authenticate('uniqueToken', (err, passportUser): void => {
        if (err) {
          return next(err);
        }
        res.status(200).json({ user: passportUser });
      })(req, res, next),
    );

    const res_1 = await request(app).get('/post').set('uniqueToken', token).expect(200);
    expect(res_1.body.user).toEqual(user);
  });

  it('should execute it properly with the query', async (): Promise<void> => {
    const token = '1234-43636-2342-12414-1234235';
    const user = { id: '123-456', name: 'test' };
    passport.use(
      'uniqueToken',
      new UniqueTokenStrategy(
        { tokenQuery: 'uniqueToken', passReqToCallback: true },
        (req, uniqueToken, done): void => {
          expect(req.query.uniquetoken).toEqual(token);
          expect(uniqueToken).toBe(token);
          done(null, user);
        },
      ),
    );
    app.get('/post', (req: Request, res: Response, next: NextFunction): void =>
      passport.authenticate('uniqueToken', (err, passportUser): void => {
        if (err) {
          return next(err);
        }

        res.status(200).json({ user: passportUser });
      })(req, res, next),
    );

    const res_1 = await request(app).get(`/post?uniquetoken=${token}`).expect(200);
    expect(res_1.body.user).toEqual(user);
  });

  it('should execute it properly with the param', async (): Promise<void> => {
    const token = '1234-43636-2342-12414-1234235';
    const user = { id: '123-456', name: 'test' };
    passport.use(
      'uniqueToken',
      new UniqueTokenStrategy(
        { tokenParams: 'uniqueToken', passReqToCallback: true },
        (req, uniqueToken, done): void => {
          expect(req.params.uniquetoken).toEqual(token);
          expect(uniqueToken).toBe(token);
          done(null, user);
        },
      ),
    );
    app.get('/post/:uniquetoken', (req: Request, res: Response, next: NextFunction): void =>
      passport.authenticate('uniqueToken', (err, passportUser, info): void => {
        if (err) {
          return next(err);
        }
        if (!passportUser) {
          console.log('info', info);
          return void res.status(400).json(info);
        }

        res.status(200).json({ user: passportUser });
      })(req, res, next),
    );

    const res_1 = await request(app).get(`/post/${token}`).expect(200);
    expect(res_1.body.user).toEqual(user);
  });

  it('should execute it properly with the body', async (): Promise<void> => {
    const token = '1234-43636-2342-12414-1234235';
    const user = { id: '123-456', name: 'test' };
    passport.use(
      'uniqueToken',
      new UniqueTokenStrategy(
        { tokenField: 'uniqueToken', passReqToCallback: true },
        (req, uniqueToken, done): void => {
          expect(req.body.uniquetoken).toEqual(token);
          expect(uniqueToken).toBe(token);
          done(null, user);
        },
      ),
    );
    app.post('/post', (req: Request, res: Response, next: NextFunction): void =>
      passport.authenticate('uniqueToken', (err, passportUser, info): void => {
        if (err) {
          return next(err);
        }
        if (!passportUser) {
          console.log('info', info);
          return void res.status(400).json(info);
        }

        res.status(200).json({ user: passportUser });
      })(req, res, next),
    );

    const res_1 = await request(app).post(`/post`).send({ uniquetoken: token }).expect(200);
    expect(res_1.body.user).toEqual(user);
  });

  it('should fail for missing credential', async (): Promise<void> => {
    passport.use(
      'uniqueToken',
      new UniqueTokenStrategy(
        { tokenHeader: 'uniqueToken', passReqToCallback: true },
        (req, uniqueToken, done): void => {
          done(null, false);
        },
      ),
    );
    app.get('/post', (req: Request, res: Response, next: NextFunction): void =>
      passport.authenticate('uniqueToken', (err, passportUser, info): void => {
        if (!passportUser) {
          return void res.status(400).json(info);
        }

        res.status(200).json({ user: passportUser });
      })(req, res, next),
    );

    const res_1 = await request(app).get('/post').expect(400);
    expect(res_1.body.message).toEqual('Missing credentials');
  });

  it('should fail for user not found in the db', async (): Promise<void> => {
    const wrongToken = '1234-45454-23422-1234235';
    const token = '1234-43636-2342-12414-1234235';
    passport.use(
      'uniqueToken',
      new UniqueTokenStrategy({ tokenHeader: 'uniqueToken' }, (uniqueToken, done): void => {
        expect(uniqueToken).toBe(wrongToken);
        done(null, uniqueToken === token);
      }),
    );
    app.get('/post', (req: Request, res: Response, next: NextFunction): void =>
      passport.authenticate('uniqueToken', (err, passportUser): void => {
        if (!passportUser) {
          return void res.status(400).json({ message: 'user not found' });
        }

        res.status(200).json({ user: passportUser });
      })(req, res, next),
    );

    const res_1 = await request(app).get('/post').set('uniqueToken', wrongToken).expect(400);
    expect(res_1.body.message).toEqual('user not found');
  });
});
