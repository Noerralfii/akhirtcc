import dotenv from 'dotenv';
dotenv.config();

import Sequelize from 'sequelize';

import CartModel from './Cart.js';
import OrderModel from './Order.js';
import ProductModel from './Product.js';
import UserModel from './User.js';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Inisialisasi semua model
const User = UserModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const Cart = CartModel(sequelize, Sequelize.DataTypes);
const Order = OrderModel(sequelize, Sequelize.DataTypes);

// Relasi antar model
User.hasMany(Cart);
Cart.belongsTo(User);
Product.hasMany(Cart);
Cart.belongsTo(Product);

User.hasMany(Order);
Order.belongsTo(User);

// Ekspor
export { sequelize, User, Product, Cart, Order };
export default { sequelize, User, Product, Cart, Order };
