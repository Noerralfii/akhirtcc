import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("Order", {
  items: {
    type: DataTypes.JSON,
  },
  total: {
    type: DataTypes.FLOAT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  }
});

export default Order;
