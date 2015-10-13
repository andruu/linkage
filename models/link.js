module.exports = function(sequelize, DataTypes) {
  var Link = sequelize.define('Link', {
    url: DataTypes.STRING
  });

  return Link;
};