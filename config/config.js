const { Sequelize } = require("sequelize");

// connecting to the database
const sequelize = new Sequelize("store_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

function connectDB() {
  sequelize
    .authenticate()
    .then(() => console.log("db connected"))
    .then(() => sequelize.sync())
    .then(() => console.log("Tables Synced"))
    .catch((error) => console.log("db error: ", error));
}
// { alter: true }

module.exports = { connectDB, sequelize };
