process.env.NODE_ENV = 'test'

var request = require('supertest');
var should  = require('should');
var app     = require('../app').app;
var models  = require('../models');

describe('Redirect for short code', function () {
	beforeEach(function (done) {
	    models.sequelize.sync({force: true})
	        .then(function () {
	        	done();
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
					// console.log(res);
					res.header['location'].should.equal('http://www.google.com');
					done();
				});
		});
	});
});