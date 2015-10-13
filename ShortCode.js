/**
 * Generate short code using base 36 conversion
 * @param {integer} id
 * @return {string}
 */
var generateShortCode = function (id) {
  return id.toString(36);
}

/**
 * Parse shortcode and return ID using base 36 conversion
 * @param {string} shortCode
 * @return {integer}
 */
var getIdFromShortCode = function (shortCode) {
  return parseInt(shortCode, 36);
}

module.exports = {
  generateShortCode:  generateShortCode,
  getIdFromShortCode: getIdFromShortCode
};