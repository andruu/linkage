var env    = process.env.NODE_ENV || "development";
var client = require("redis").createClient();

var set = function (key, value, callback) {
  key = env + ':' + key;

  client.set(key, value, callback);
};

var get = function (key, callback) {
  key = env + ':' + key;

  client.get(key, callback);
};

var deletePattern = function (pattern, callback) {
  client.keys(pattern, function handleKeys (err, keys) {
    if (err) {
      return callback(err);
    }

    if (keys.length) {
      client.del(keys, callback);
    } else {
      callback(null);
    }
  });
};

module.exports = {
  set:           set,
  get:           get,
  deletePattern: deletePattern
};
