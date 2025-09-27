const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// To create table in DB, run: Patient.sync({ force: true });
// If table already exists, use force: true to drop and recreate
const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    birthdate: DataTypes.STRING,
    gender: DataTypes.STRING,
    bloodType: DataTypes.STRING,
    password: DataTypes.STRING
}, {
    tableName: 'patients',
    timestamps: false
});

module.exports = Patient;