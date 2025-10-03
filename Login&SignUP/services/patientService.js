const Patient = require('../models/Patient');
const User = require('../models/Users');

// Create new patient (during signup)
async function createPatient(user) {
    return await Patient.create(user);
}

// Get patient by USER id (joins with User)
async function getPatientByUserId(userId) {
    return await Patient.findOne({
        where: { id_user: userId },
        include: [{ model: User }]
    });
}

// Update patient by PATIENT id (rarely used)
async function updatePatient(id_patient, updates) {
    return await Patient.update(updates, { where: { id_patient } });
}

// Update patient by USER id (used in profile editing)
async function updatePatientByUserId(id_user, updates) {
    return await Patient.update(updates, { where: { id_user } });
}

// Delete patient by PATIENT id
async function deletePatient(id_patient) {
    return await Patient.destroy({ where: { id_patient } });
}

// Delete patient by USER id (used when deleting account)
async function deletePatientByUserId(id_user) {
    return await Patient.destroy({ where: { id_user } });
}

module.exports = { 
    createPatient, 
    getPatientByUserId, 
    updatePatient, 
    updatePatientByUserId, 
    deletePatient, 
    deletePatientByUserId 
};