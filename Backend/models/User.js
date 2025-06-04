import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

User.prototype.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default User;
