export default (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    price: { type: DataTypes.FLOAT, allowNull: false },
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  });
};
