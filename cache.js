var env   = process.env.NODE_ENV || "development";
var redis = require("redis");
require('redis-delete-wildcard')(redis);
var client = redis.createClient();

var set = function (key, value, callback) {
  key = env + ':' + key;

  client.set(key, value, callback);
};

var get = function (key, callback) {
  key = env + ':' + key;

  client.get(key, callback);
};

var deletePattern = function (pattern, callback) {
  client.delwild(pattern, callback);
};

module.exports = {
  set:           set,
  get:           get,
  deletePattern: deletePattern
};
