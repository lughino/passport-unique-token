# Passport Unique Token Strategy

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
  });
}
```

## Credits

[Luca Pau](http://github.com/Lughino)

## License

(The MIT License)

Copyright (c) 2019 Luca Pau

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
