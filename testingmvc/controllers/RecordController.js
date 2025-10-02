const Record = require("../models/medical_record");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");


async function getAllRecord(idPt){
    try{
        const record = await Record.findAll({
            where:{
                id_patient : idPt
            },
            include: [{
                model: Appointment,
                where: {
                    status: "FINISHED"
                },
                include: Doctor
            }],
            order: [["id_record", "DESC"]]
            
        });
        return record;
    }
    catch(err){
        throw err;
    }

    
}


module.exports = {getAllRecord}