process.env.NODE_ENV = 'test'

var request  = require('supertest');
var should   = require('should');
var async    = require('async');
var app      = require('../app').app;
var services = require("../services");
var models   = require('../models');
var cache    = require('../cache');

describe('Get Links', function () {
  beforeEach(function (done) {
    models.sequelize.sync({force: true})
        .then(function () {
          cache.deletePattern('test:short-code:*', function (err) {
            done();
          });
        });
  });

  describe('GET /links', function () {
    beforeEach(function (done) {
      async.parallel([
        function (cb) { services.createLink('http://apple.com', function () {cb(null)}); },
        function (cb) { services.createLink('http://apple.com', function () {cb(null)}); },
        function (cb) { services.createLink('http://apple.com', function () {cb(null)}); },
        function (cb) { services.createLink('http://apple.com', function () {cb(null)}); },
        function (cb) { services.createLink('http://apple.com', function () {cb(null)}); }
      ], function (err, results) {
        done();
      });
    });

    it('get a list of links', function (done) {
      request(app)
        .get('/links')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          var data = JSON.parse(res.text);
          data[0].url.should.equal('http://apple.com');

          done();
        });
    });
  });
});
