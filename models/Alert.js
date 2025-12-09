const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");
const NewItem = require("./NewItem");
const Stores = require("./Store");
const Alerts = sequelize.define("Alerts", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: NewItem,
            key: "id",
        },
    },
    store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Stores,
            key: "id",
        },
    },
    qoh: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Alerts