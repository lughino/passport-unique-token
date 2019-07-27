# Passport Unique Token Strategy

[![CircleCI](https://circleci.com/gh/Lughino/passport-unique-token.svg?style=svg)](https://circleci.com/gh/Lughino/passport-unique-token)
[![Maintainability](https://api.codeclimate.com/v1/badges/6cbbdc635903006b578e/maintainability)](https://codeclimate.com/github/Lughino/passport-unique-token/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6cbbdc635903006b578e/test_coverage)](https://codeclimate.com/github/Lughino/passport-unique-token/test_coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a2ec6c1319b6497494303ee024e45cb5)](https://www.codacy.com/app/Lughino/passport-unique-token?utm_source=github.com&utm_medium=referral&utm_content=Lughino/passport-unique-token&utm_campaign=Badge_Grade)
![npm](https://img.shields.io/npm/dm/passport-unique-token)
![npm](https://img.shields.io/npm/v/passport-unique-token)
![GitHub](https://img.shields.io/github/license/Lughino/passport-unique-token)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Unique token authentication strategy for Passport.

## Installation

```sh
npm install passport-unique-token
```

## Usage

The unique token authentication strategy authenticates users with a unique token. The strategy requires a verify callback, which accepts these credentials and calls done providing a user.

```javascript
const { UniqueTokenStrategy } = require('passport-unique-token');

passport.use(
  new UniqueTokenStrategy(function(token, done) {
    User.findOne({ uniqueToken: token, expireToken: { $gt: Date.now() } }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    });
  }),
);
```

By default, `passport-unique-token` checks for `token` credentials in either the params url or request body in these locations:

| Type   | Default property |
| ------ | :--------------: |
| Url    |      token       |
| Body   |      token       |
| Query  |      token       |
| Header |      token       |

### Configure

These credential locations can be configured when defining the strategy as follows:

```javascript
const { UniqueTokenStrategy } = require('passport-unique-token');
const strategyOptions = {
  tokenQuery: 'custom-token',
  tokenParams: 'custom-token',
  tokenField: 'custom-token',
  tokenHeader: 'custom-token',
  failedOnMissing: false
};

passport.use(new UniqueTokenStrategy(strategyOptions,
  function (token, done) {
    User.findOne({ uniqueToken: token, expireToken: { $gt: Date.now() } }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    });
  }
```

`failOnMissing` option allows you to queue multiple strategy, customizing the behavior.
By default it is set to `true`, if set to `false` it lets move on to the next strategy on failure.

## Authenticate

Use `passport.authenticate()`, specifying the `token` strategy to authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/) application:

```javascript
app.put('/animals/dogs', passport.authenticate('token'), function(req, res) {
  // User authenticated and can be found in req.user
});
```

If authentication fails in the above example then a `401` response will be given. However there may be times you wish a bit more control and delegate the failure to your application:

```javascript
app.put('/animals/dogs', authenticate, function(req, res) {
  // User authenticated and can be found in req.user
});

function authenticate(req, res, next) {
  passport.authenticate('token', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401).json({ message: 'Incorrect token credentials' });
    }

    req.user = user;
    next();
  })(req, res, next);
}
```

## Credits

[Luca Pau](http://github.com/Lughino)
