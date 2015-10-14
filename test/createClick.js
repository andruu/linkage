process.env.NODE_ENV = 'test'

var request = require('supertest');
var should  = require('should');
var app     = require('../app').app;
var models  = require('../models');
var cache   = require('../cache');

describe('Redirect for short code', function () {
  beforeEach(function (done) {
    models.sequelize.sync({force: true})
        .then(function () {
          cache.deletePattern('test:short-code:*', function (err) {
            done();
          });
        });
  });

  describe('GET /:shortCode', function () {
    beforeEach(function (done) {
      models.Link.create({url: 'http://www.google.com'}).then(function () {
        done();
      });
    });

    it('should redirect to link', function (done) {
      request(app)
        .get('/1')
        .end(function (err, res) {
          res.header['location'].should.equal('http://www.google.com');
          done();
        });
    });

    it('should return a 403 status if no short code exists', function (done) {
      request(app)
        .get('/nonexisting')
        .expect(403)
        .end(function (err, res) {
          res.text.should.equal('{"error":"Link not found"}')
          done();
        });
    });
  });
});
