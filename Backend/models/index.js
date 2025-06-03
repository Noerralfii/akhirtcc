import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

import User from './User.js';
import Product from './Product.js';
import Cart from './Cart.js';
import Order from './Order.js';

// Relasi antar model (semuanya di sini!)
User.hasMany(Cart);
Cart.belongsTo(User);

Product.hasMany(Cart);
Cart.belongsTo(Product);

User.hasMany(Order);
Order.belongsTo(User);

export { sequelize, User, Product, Cart, Order };
export default { sequelize, User, Product, Cart, Order };
