/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai'),
    Strategy = require('../lib/strategy');


describe('Strategy', function() {

    describe('handling a request with valid credentials in body', function() {
        var strategy = new Strategy(function(token, done) {
            if(token === 'sdvoihweui3498d9vhwoufhi8h') {
                return done(null, { id : '1234' }, { scope : 'read' });
            }
            return done(null, false);
        });

        var user,
            info;

        before(function(done) {
            chai.passport(strategy)
                .success(function(u, i) {
                    user = u;
                    info = i;
                    done();
                })
                .req(function(req) {
                    req.body = {};
                    req.body.token = 'sdvoihweui3498d9vhwoufhi8h';
                })
                .authenticate();
        });

        it('should supply user', function() {
            expect(user).to.be.an.object;
            expect(user.id).to.equal('1234');
        });

        it('should supply info', function() {
            expect(info).to.be.an.object;
            expect(info.scope).to.equal('read');
        });
    });

    describe('handling a request with valid credentials in query', function() {
        var strategy = new Strategy(function(token, done) {
            if(token === 'sdvoihweui3498d9vhwoufhi8h') {
                return done(null, { id : '1234' }, { scope : 'read' });
            }
            return done(null, false);
        });

        var user,
            info;

        before(function(done) {
            chai.passport(strategy)
                .success(function(u, i) {
                    user = u;
                    info = i;
                    done();
                })
                .req(function(req) {
                    req.query = {};
                    req.query.token = 'sdvoihweui3498d9vhwoufhi8h';
                })
                .authenticate();
        });

        it('should supply user', function() {
            expect(user).to.be.an.object;
            expect(user.id).to.equal('1234');
        });

        it('should supply info', function() {
            expect(info).to.be.an.object;
            expect(info.scope).to.equal('read');
        });
    });

    describe('handling a request without a body', function() {
        var strategy = new Strategy(function(token, done) {
            throw new Error('should not be called');
        });

        var info, status;

        before(function(done) {
            chai.passport(strategy)
                .fail(function(i, s) {
                    info = i;
                    status = s;
                    done();
                })
                .authenticate();
        });

        it('should fail with info and status', function() {
            expect(info).to.be.an.object;
            expect(info.message).to.equal('Missing credentials');
            expect(status).to.equal(400);
        });
    });

    describe('handling a request with a body, but no token', function() {
        var strategy = new Strategy(function(token, done) {
            throw new Error('should not be called');
        });

        var info, status;

        before(function(done) {
            chai.passport(strategy)
                .fail(function(i, s) {
                    info = i;
                    status = s;
                    done();
                })
                .req(function(req) {
                    req.body = {};
                })
                .authenticate();
        });

        it('should fail with info and status', function() {
            expect(info).to.be.an.object;
            expect(info.message).to.equal('Missing credentials');
            expect(status).to.equal(400);
        });
    });

    describe('handling a request with a body, but no token, and not failed options', function() {
        var strategy = new Strategy({ failedOnMissing: false }, function(token, done) {
            throw new Error('should not be called');
        });

        var info, status;

        before(function(done) {
            chai.passport(strategy)
                .pass(function() {
                    done();
                })
                .req(function(req) {
                    req.body = {};
                })
                .authenticate();
        });

        it('should fail with info and status', function() {
            expect(info).to.not.be.an.object;
            expect(status).to.equal(undefined);
        });
    });

});
