const Patient = require('../db/patientControler');

async function createPatient(user) {
    return await Patient.create(user);
}

async function getPatientById(id) {
    return await Patient.findByPk(id);
}

async function updatePatient(id, updates) {
    return await Patient.update(updates, { where: { id } });
}

async function deletePatient(id) {
    return await Patient.destroy({ where: { id } });
}

module.exports = { createPatient, getPatientById, updatePatient, deletePatient };