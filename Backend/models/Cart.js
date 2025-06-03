odule.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cart', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  });
};
