const Doctor = require("../models/doctor");
const Category = require("../models/category");

async function getAllDoctor(){
    try{
        const doctors = await Doctor.findAll({
            include: Category
        });
        return doctors;
    }
    catch(err){
        throw err;
    }

}

async function findDoctor(data){
    try{
        const doctor = await Doctor.findByPk(data);
        return doctor;
    }
    catch(err){
        throw err;
    }
}

module.exports = {getAllDoctor, findDoctor}