
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");
const NewItems = require("./NewItem");
const Stores = require("./Store");
const Users = require("./User");
const ImportedItems = sequelize.define("Imported_items", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  new_item_id: {
    type: DataTypes.INTEGER,
    references: {
      model: NewItems,
      key: "id",
    },
    allowNull: false,
  },
  qoh: {
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
  importer: {
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
ImportedItems.belongsTo(Stores, {
  foreignKey: "store_id",
  as: "store"
})

// ASSOCIATION FOR NEW ITEM INFO  
ImportedItems.belongsTo(NewItems, {
  foreignKey: 'new_item_id',
  as: "newItem"
})

module.exports = ImportedItems