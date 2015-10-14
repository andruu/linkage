var assert   = require('chai').assert;
var async    = require('async');
var services = require("../services");
var models   = require('../models');
var utils    = require('../utils');

describe('services', function () {
	beforeEach(function (done) {
	    models.sequelize.sync({force: true})
	        .then(function () {
	            done();
	        });
	});
	
	describe('#createLink', function () {
		it('should create a new link', function (done) {
			services.createLink('http://somelink.com', function (err, shortCode) {
				if (err) throw err;
				assert.equal(1, shortCode);
				done();
			});
		});
	});

	describe('#createClick', function () {
		it('should create a new click', function (done) {
			services.createClick('3f', 'ip', 'referrer', 'userAgent', function (err, click) {
				if (err) throw err;
				assert.equal(123, click.linkId);
				done();
			});
		});
	});

	describe('#getStats', function () {
		it('should get stats', function (done) {
			async.parallel([
				function (cb) { services.createLink('http://somelink.com', function () {cb(null)}); },
				function (cb) { services.createClick(1, 'ip', 'referrer', 'userAgent', function () {cb(null)}); },
				function (cb) { services.createClick(1, 'ip', 'referrer', 'userAgent', function () {cb(null)}); },
				function (cb) { services.createClick(1, 'ip', 'referrer', 'userAgent', function () {cb(null)}); }
			], function (err, results) {
				services.getStats(1, 'link', function (err, stats) {
					assert.equal(3, stats.count);
					assert.equal('link', stats.url);
					assert.equal(3, stats.clicks.length);
					done();
				});
			});
		});
	});

	describe('#getLinks', function () {
		it('should get all the links', function (done) {
			async.parallel([
				function (cb) { services.createLink('http://somelink.com', function () {cb(null)}); },
				function (cb) { services.createLink('http://somelink.com', function () {cb(null)}); },
				function (cb) { services.createLink('http://somelink.com', function () {cb(null)}); },
				function (cb) { services.createLink('http://somelink.com', function () {cb(null)}); },
				function (cb) { services.createLink('http://somelink.com', function () {cb(null)}); }
			], function (err, results) {
				services.getLinks('http://theurl', function (err, links) {
					assert.equal(5, links.length);
					assert.equal('http://theurl/1', links[0].shortenedUrl);
					done();
				});
			});
		});
	});

});

