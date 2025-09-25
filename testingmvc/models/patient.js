const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../koneksi");
const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/ 
const Patient = sequelize.define("Patients",{
    id_patient:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn: [["Male", "Female"]]
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        
        validate:{
                validator: function(v) {
                return phoneValidationRegex.test(v);      
            },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    city_of_birth: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth:{
        type: DataTypes.DATE,
        allowNull: false
    },
    blood_type: {
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
        tableName: "patients",
        timestamps: false,
    }  
    
);


module.exports = Patient;