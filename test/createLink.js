process.env.NODE_ENV = 'test'

var request = require('supertest');
var should  = require('should');
var app     = require('../app').app;
var models  = require('../models');
var cache   = require('../cache');

describe('Create Link', function () {
  beforeEach(function (done) {
    models.sequelize.sync({force: true})
        .then(function () {
          cache.deletePattern('test:short-code:*', function (err) {
            done();
          });
        });
  });

  describe('POST /create', function () {
    it('should create a new link', function (done) {
      var payload = {url: 'http://www.whowhowho.com'};

      request(app)
        .post('/create')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          should.not.exist(err);

          var obj = JSON.parse(res.text);
          obj.should.have.keys('url');
          done();
        });
    });

    it('should return a 403 if no url exists', function (done) {
      var payload = {};

      request(app)
        .post('/create')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.equal('{"error":"No url detected"}')
          done();
        });
    });

    it('should return a 403 if no url is invald', function (done) {
      var payload = {url: 'invalidurl'};

      request(app)
        .post('/create')
        .send(payload)
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          should.not.exist(err);
          res.text.should.equal('{"error":"Url not valid: invalidurl"}')
          done();
        });
    });
  });
});
