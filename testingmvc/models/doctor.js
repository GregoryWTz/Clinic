const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../koneksi");
const Category = require("./category");
const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/ 
const Doctor = sequelize.define("Doctor",{
    id_doctor:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    id_category: {
        type: DataTypes.STRING,
        allowNull: false,
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
    photo:
    {
        type: DataTypes.BLOB,
        allowNull:true
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
        tableName: "doctors",
        timestamps: false,
    }  
    
);

Doctor.belongsTo(Category, {
  foreignKey: "id_category",
  targetKey: "id_category"
});
module.exports = Doctor;