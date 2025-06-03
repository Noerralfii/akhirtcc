import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cart = sequelize.define("Cart", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
});

export default Cart;
