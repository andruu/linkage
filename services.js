var redis     = require("redis");
var client    = redis.createClient();
var models    = require("./models");
var ShortCode = require("./ShortCode");

/**
 * Create link and return shortcode in callback
 * @param {string} url
 * @param {requestCallback} callback
 */
var createLink = function (url, callback) {
  models.Link.create({url: url}).then(function (link) {
    var shortCode = ShortCode.generateShortCode(link.id);
    var key = 'short-code:' + shortCode;

    client.set(key, url);
    callback(null, shortCode);
  });
};

/**
 * Create link and return link in callback
 * @param {string} shortCode
 * @param {string} ip
 * @param {string} referrer
 * @param {string} userAgent
 * @param {requestCallback} callback
 */
var createClick = function (shortCode, ip, referrer, userAgent, callback) {
  models.Click.create({
    linkId:    ShortCode.getIdFromShortCode(shortCode),
    ipAddress: ip,
    referrer:  referrer,
    userAgent: userAgent
  }).then(function (click) {
    callback(null, click);
  });
};

module.exports = {
  createLink:  createLink,
  createClick: createClick
};