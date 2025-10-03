const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const User = sequelize.define("User",{
    id_user:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM("admin", "doctor", "patient", "pharmacist"),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^[0-9]{8,15}$/  // allows 8–15 digits
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    last_updated_at:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: true
    }
},
{
    tableName: "users",
    timestamps: false,
});

module.exports = User;