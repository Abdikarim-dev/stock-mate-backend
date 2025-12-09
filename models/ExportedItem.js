const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const Users = require("./User");
const Stores = require("./Store");
const NewItem = require("./NewItem");
const ExportedItems = sequelize.define("Exported_items", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  new_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: NewItem,
      key: "id",
    },
  },
  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  store_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stores,
      key: "id",
    },
  },
  exporter: {
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

// ASSOCIATION FOR STORE
ExportedItems.belongsTo(Stores, {
  foreignKey: "store_id",
  as: "store"
})

// ASSOCIATION FOR NEW ITEM INFO  
ExportedItems.belongsTo(NewItem, {
  foreignKey: 'new_item_id',
  as: "newItem"
})
module.exports = ExportedItems