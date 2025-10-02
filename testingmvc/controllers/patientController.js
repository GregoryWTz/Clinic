const Patient = require('../models/patient');


async function createPatient(data, id_users) {
    try{
        let id = "";
        const checkempty = await Patient.findAndCountAll();
        console.log(checkempty);
        if(checkempty.count <= 0){
            id = "PS001";
        }
        else{
            const last = await Patient.findOne({
                order: [["id_patient", "DESC"]]
            });
            console.log(last);
            const newNum = parseInt(last.id_patient.slice(2), 10) + 1;
            id = "PS" + String(newNum).padStart(3, '0');
        }
        let kondisi = "Tidak ada"
        if(data.condition){
            kondisi = data.condition;
        }
        const apt = await Patient.create({
            id_patient: id,
            id_user: id_users,
            first_name: data.first_name,
            last_name: data.last_name,
            city_of_birth: data.city_of_birth,
            date_of_birth: data.date_of_birth,
            address: data.address,
            gender: data.gender,
            blood_type: data.blood_type,
            condition: kondisi,
            
        });

        return apt
    }catch(err){
        throw err;
    }
}


async function getPatientById(id) {
    return await Patient.findByPk(id);
}

async function getPatientByIdUser(id) {
    const check =  await Patient.findOne({
        where: {
            id_user: id
        }
    });
    return check;
}

async function updatePatient(id, updates) {
    return await Patient.update(updates, { where: { id } });
}

async function deletePatient(id) {
    return await Patient.destroy({ where: { id } });
}


module.exports = { createPatient, getPatientById, updatePatient, deletePatient, getPatientByIdUser };