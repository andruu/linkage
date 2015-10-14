var validator = require('validator');
var models    = require("./models");
var utils     = require("./utils");
var cache     = require('./cache');

/**
 * Retrieve link from the database
 * @param {integer} id
 * @param {requestCallback} callback
 */
var linkFromDatabase = function (id, callback) {
  models.Link.findById(id).then(function (link) {
    if (! link) {
      callback(true, null);
    } else {
      callback(null, link.url);
    }
  });
};

/**
 * Retrieve link from the cache
 * @param {integer} shortCode
 * @param {requestCallback} callback
 */
var linkFromCache = function (shortCode, callback) {
  var lookup = 'short-code:' + shortCode;

  cache.get(lookup, function (err, link) {
    if (! link) {
      callback(true, null);
    } else {
      callback(null, link);
    }
  });
};

/**
 * Validates URL coming from POST request
 * @param {Object} req
 * @param {Object} res
 * @param {requestCallback} next
 */
var validateUrl = function (req, res, next) {
  var url = req.body.url;

  if (! url) {
    res.status(403).json({ error: 'No url detected' });
  } else if (! validator.isURL(url, {require_protocol: true})) {
    res.status(403).json({error: 'Url not valid: ' + url});
  } else {
    next();
  }
};

/**
 * Checks if short code exists, first checks the cache
 * if code does not exist in cache checks the database.
 * @param {Object} req
 * @param {Object} res
 * @param {requestCallback} next
 */
var shortCodeExists = function (req, res, next) {
  var shortCode = req.params.shortCode;
  var id        = utils.getIdFromShortCode(shortCode);

  linkFromCache(shortCode, function (err, link) {
    if (err) {
      linkFromDatabase(id, function (err, link) {
        if (err) {
          res.status(403).json({error: 'Link not found'});
        } else {
          req.retrievedLink = link;
          next();
        }
      });
    } else {
      req.retrievedLink = link;
      next();
    }
  });
};

module.exports = {
  validateUrl:     validateUrl,
  shortCodeExists: shortCodeExists
};
