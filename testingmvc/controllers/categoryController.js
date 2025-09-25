const Doctor = require("../models/doctor");
const Category = require("../models/category");

async function getAllCategory(){
    try{
        const categories = await Category.findAll();
        return categories;
    }
    catch(err){
        throw err;
    }

}

module.exports = {getAllCategory}