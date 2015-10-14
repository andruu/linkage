process.env.NODE_ENV = 'test'

var request = require('supertest');
var should  = require('should');
var app     = require('../app').app;
var models  = require('../models');

describe('Create Link', function () {
	beforeEach(function (done) {
	    models.sequelize.sync({force: true})
	        .then(function () {
	        	done();
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
					res.text.should.equal('{"url":"http://localhost:3000/1"}')
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
