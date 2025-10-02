const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("db_rumahsakit", "root", "", {
  host: "192.168.56.1", // Windows host IP
  port: 3307,
  dialect: "mysql",
});

module.exports = sequelize;
