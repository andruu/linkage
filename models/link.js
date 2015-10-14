var utils = require("../utils");

module.exports = function(sequelize, DataTypes) {
  var Link = sequelize.define('Link', {
    url: DataTypes.STRING
  }, {
    getterMethods: {
      shortCode: function () {
        return utils.generateShortCode(this.id);
      }
    }
  });

  return Link;
};