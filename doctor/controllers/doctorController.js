const Doctor = require("../models/doctor");
const Category = require("../models/category");

async function getAllDoctor(){
    try{
        const doctors = await Doctor.findAll({
            include: {
                model: Category,
                as: "category",
            },
        });
        return doctors;
    }
    catch(err){
        throw err;
    }

}

async function searchByCategory(cat) {
    try{
        const doctors = await Doctor.findAll({
            include: {
                model: Category,
                as: "category",
                where: { category_name: cat },
            },
        });
        return doctors;
    }
    catch(err){
        throw err;
    }
}

module.exports = {getAllDoctor}