var cache  = require('./cache');
var models = require("./models");
var utils  = require("./utils");

/**
 * Create link and return shortcode in callback
 * @param {string} url
 * @param {requestCallback} callback
 */
var createLink = function (url, callback) {
  models.Link.create({url: url}).then(function (link) {
    var shortCode = utils.generateShortCode(link.id);
    var key       = 'short-code:' + shortCode;

    cache.set(key, url);
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
    linkId:    utils.getIdFromShortCode(shortCode),
    ipAddress: ip,
    referrer:  referrer,
    userAgent: userAgent
  }).then(function (click) {
    callback(null, click);
  });
};

/**
 * Get stats for short code
 * @param {string} shortCode
 * @param {string} link
 * @param {requestCallback} callback
 */
var getStats = function (shortCode, link, callback) {
  models.Click.findAndCountAll({where: {linkId: utils.getIdFromShortCode(shortCode)}}).then(function (results) {
    var stats = {
      url: link,
      count: results.count,
      clicks: results.rows
    };

    callback(null, stats);
  });
}

/**
 * Get all links
 * @param {string} url
 * @param {requestCallback} callback
 */
var getLinks = function (url, callback) {
  models.Link.findAll().then(function (links) {
    links = links.map(function (link) {
      link              = link.get({plain: true});
      link.shortenedUrl = url + '/' + link.shortCode;
      link.statsUrl     = url + '/' + link.shortCode + '/stats';

      return link;
    });
    callback(null, links);
  });
};

module.exports = {
  createLink:  createLink,
  createClick: createClick,
  getStats:    getStats,
  getLinks:    getLinks
};