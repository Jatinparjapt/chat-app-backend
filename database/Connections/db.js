const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

// Test Connection
sequelize
  .authenticate()
  .then(() => console.log("MySQL Connected!"))
  .catch((err) => console.error("Unable to connect to MySQL:", err));

module.exports = sequelize;
