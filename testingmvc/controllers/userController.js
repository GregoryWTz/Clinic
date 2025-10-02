const User = require('../models/user');
const Patient = require('../models/patient');
const patientController = require("./patientController");

async function createUser(data){
    try{
        let id = "";
        const checkempty = await User.findAndCountAll();
        console.log(checkempty);
        if(checkempty.count <= 0){
            id = "US001";
        }
        else{
            const last = await User.findOne({
                order: [["id_user", "DESC"]]
            });
            console.log(last);
            const newNum = parseInt(last.id_user.slice(2), 10) + 1;
            id = "US" + String(newNum).padStart(3, '0');
        }

        const apt = await User.create({
            id_user: id,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: "patient",
            
            
        });

        await patientController.createPatient(data, id);
        
        return apt;    

    }
    catch(err){
        throw err;
    }
}
async function findByUsername(username) {
    return await User.findOne(
        {
            where:{
                username
            }
        }
    );
}
async function findByPhone(phone) {
    return await User.findOne(
        {
            where:{
                phone
            }
        }
    );
}
async function findByEmail(email) {
    return await User.findOne(
        {
            where:{
                email
            }
        }
    );
}

async function findById(id) {
    return await User.findByPk(id);
}
module.exports = {createUser, findByUsername, findByPhone, findByEmail, findById}