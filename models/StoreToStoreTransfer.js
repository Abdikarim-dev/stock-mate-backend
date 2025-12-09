const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");
const Users = require("./User");
const Stores = require("./Store");
const NewItem = require("./NewItem");
const StoreToStoreTransfer = sequelize.define("StoreToStoreTransfer", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  new_item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: NewItem,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  store_from_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stores,
      key: "id",
    },
  },
  store_to_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stores,
      key: "id",
    },
  },
  transfer_by: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: "id",
    },
  },
});
module.exports = StoreToStoreTransfer