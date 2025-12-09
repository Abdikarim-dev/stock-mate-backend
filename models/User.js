const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const Users = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM(["admin", "staff"]),
    defaultValue: "staff",
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue:
      "https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Users;

// {
//   id: 3,
//   itemId: 3,
//   title: "Item Alert",
//   description: `Warning: The quantity of Bataati in Siinaay Store is low. 
//                  Only 10 left.`,
// }