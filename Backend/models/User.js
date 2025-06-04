import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from bcryptjs;

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Nama tidak boleh kosong"
      },
      len: {
        args: [3, 50],
        msg: "Nama harus antara 3 hingga 50 karakter"
      }
    }
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: {
      msg: "Email sudah terdaftar"
    },
    validate: {
      isEmail: {
        msg: "Format email tidak valid"
      },
      notEmpty: {
        msg: "Email tidak boleh kosong"
      }
    }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password tidak boleh kosong"
      },
      len: {
        args: [6, 100],
        msg: "Password minimal 6 karakter"
      }
    }
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Hook untuk hash password sebelum create
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Method untuk membandingkan password
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default User;