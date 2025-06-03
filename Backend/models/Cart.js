// models/Cart.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

// Relasi (biarkan Sequelize yang handle foreign key)
Cart.belongsTo(User); // akan otomatis buat kolom `UserId`
Cart.belongsTo(Product); // akan otomatis buat kolom `ProductId`

export default Cart;
