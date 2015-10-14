var assert = require('chai').assert;
var utils  = require("../utils");

describe('utils', function () {
	describe('#generateShortCode', function () {
		it('should generate short code from id', function () {
			assert.equal('1', utils.generateShortCode(1));
			assert.equal('3f', utils.generateShortCode(123));
		});
	});

	describe('#getIdFromShortCode', function () {
		it('should get ID from short code', function () {
			assert.equal('123', utils.getIdFromShortCode('3f'));
			assert.equal('1', utils.getIdFromShortCode('1'));
		});
	});
});