const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_rumahsakit", "root", "test", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

module.exports = sequelize;