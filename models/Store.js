const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const Stores = sequelize.define("stores", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  store_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  store_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Stores;
