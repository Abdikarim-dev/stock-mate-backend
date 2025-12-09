const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const NewItem = sequelize.define("new_item", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  item_category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = NewItem;
