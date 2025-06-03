module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Order', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    items: { type: DataTypes.JSON },
    total: DataTypes.FLOAT,
    status: { type: DataTypes.STRING, defaultValue: 'pending' },
  });
};
