test:
	@NODE_ENV="test" \
	./node_modules/.bin/mocha --reporter spec -u tdd --require "chai" --require ./tests/bootstrap/node tests/*.test.js

lint:
	./node_modules/gulp/bin/gulp.js lint

.PHONY: test