const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");
const Stores = require("./Store");
const Users = require("./User");
const NewItem = require("./NewItem");
const DamagedItems = sequelize.define("Damaged_items", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
DamagedItems.belongsTo(Stores, {
  foreignKey: "store_id",
  as: "store"
})

// ASSOCIATION FOR NEW ITEM INFO  
DamagedItems.belongsTo(NewItem, {
  foreignKey: 'new_item_id',
  as: "newItem"
})
module.exports = DamagedItems