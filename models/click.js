module.exports = function(sequelize, DataTypes) {
  var Click = sequelize.define('Click', {
    linkId: DataTypes.INTEGER,
    ipAddress: DataTypes.STRING,
    referrer: DataTypes.STRING,
    userAgent: DataTypes.STRING
  });

  return Click;
};