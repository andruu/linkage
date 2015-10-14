process.env.NODE_ENV = 'test'

var request  = require('supertest');
var should   = require('should');
var async    = require('async');
var app      = require('../app').app;
var services = require("../services");
var models   = require('../models');
var cache    = require('../cache');

describe('Get Stats', function () {
  beforeEach(function (done) {
    models.sequelize.sync({force: true})
        .then(function () {
          cache.deletePattern('test:short-code:*', function (err) {
            done();
          });
        });
  });

  describe('GET /:shortCode/stats', function () {
    beforeEach(function (done) {
      async.parallel([
        function (cb) { services.createLink('http://apple.com', function () {cb(null)}); },
        function (cb) { services.createClick(1, 'ip', 'referrer', 'userAgent', function () {cb(null)}); },
        function (cb) { services.createClick(1, 'ip', 'referrer', 'userAgent', function () {cb(null)}); },
        function (cb) { services.createClick(1, 'ip', 'referrer', 'userAgent', function () {cb(null)}); }
      ], function (err, results) {
        done();
      });
    });

    it('get a list of links', function (done) {
      request(app)
        .get('/1/stats')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          var stats = JSON.parse(res.text);

          stats.count.should.equal(3);
          stats.url.should.equal('http://apple.com');
          stats.clicks.length.should.equal(3);

          done();
        });
    });
  });
});
