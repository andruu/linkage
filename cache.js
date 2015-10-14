var env = process.env.NODE_ENV || "development";

if (env === 'test') {
  var client = require("fakeredis").createClient();
} else {
  var client = require("redis").createClient();
}

var set = function (key, value, callback) {
  key = env + ':' + key;

  client.set(key, value, callback);
};

var get = function (key, callback) {
  key = env + ':' + key;

  client.get(key, callback);
};

module.exports = {
  set: set,
  get: get
};
