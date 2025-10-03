const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dbclinic', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306, // change if Laragon/MySQL uses 3307
});

sequelize.authenticate()
    .then(() => console.log('✅ Database connected'))
    .catch(err => console.error('❌ Database connection error:', err));

module.exports = sequelize;
