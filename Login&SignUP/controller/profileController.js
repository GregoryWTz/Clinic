// controller/profileController.js
const fs = require('fs');
const path = require('path');
const { 
    getPatientByUserId, 
    updatePatientByUserId, 
    deletePatientByUserId 
} = require('../services/patientService');
const User = require('../models/Users'); // adjust path based on your project structure

const VIEWS_DIR = path.join(__dirname, '..', 'views');

async function handleProfile(req, res, userId) {
    let patient = await getPatientByUserId(userId);

    if (!patient) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('User not found');
        return;
    }

    // --- View profile ---
    if (req.method === 'GET' && req.url === '/profile') {
        fs.readFile(path.join(VIEWS_DIR, 'profile.html'), 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading profile page');
            } else {
                let birthdate = patient.date_of_birth 
                    ? new Date(patient.date_of_birth).toISOString().split('T')[0] 
                    : '';

                let filled = content
                    .replace('{{firstname}}', patient.first_name || '')
                    .replace('{{lastname}}', patient.last_name || '')
                    .replace('{{email}}', patient.User?.email || '')
                    .replace('{{phone}}', patient.User?.phone || '')
                    .replace('{{cityOfBirth}}', patient.city_of_birth || '')
                    .replace('{{address}}', patient.address || '')
                    .replace('{{birthdate}}', patient.date_of_birth?.toISOString().split('T')[0] || '')
                    .replace('{{gender}}', patient.gender || '')
                    .replace('{{bloodType}}', patient.blood_type || '')
                    .replace('{{condition}}', patient.condition || '');

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(filled);
            }
        });
    }

    // --- Edit profile form ---
    else if (req.method === 'GET' && req.url === '/profile/edit') {
        fs.readFile(path.join(VIEWS_DIR, 'profile_edit.html'), 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading edit page');
            } else {
                let genderOptions = `
                    <option value="Male" ${patient.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${patient.gender === 'Female' ? 'selected' : ''}>Female</option>
                `;

                let bloodTypeOptions = `
                    <option value="A+" ${patient.blood_type === 'A+' ? 'selected' : ''}>A+</option>
                    <option value="A-" ${patient.blood_type === 'A-' ? 'selected' : ''}>A-</option>
                    <option value="B+" ${patient.blood_type === 'B+' ? 'selected' : ''}>B+</option>
                    <option value="B-" ${patient.blood_type === 'B-' ? 'selected' : ''}>B-</option>
                    <option value="AB+" ${patient.blood_type === 'AB+' ? 'selected' : ''}>AB+</option>
                    <option value="AB-" ${patient.blood_type === 'AB-' ? 'selected' : ''}>AB-</option>
                    <option value="O+" ${patient.blood_type === 'O+' ? 'selected' : ''}>O+</option>
                    <option value="O-" ${patient.blood_type === 'O-' ? 'selected' : ''}>O-</option>
                `;

                let birthdate = patient.date_of_birth 
                    ? new Date(patient.date_of_birth).toISOString().split('T')[0] 
                    : '';

                let filled = content
                    .replace('{{firstname}}', patient.first_name || '')
                    .replace('{{lastname}}', patient.last_name || '')
                    .replace('{{email}}', patient.User?.email || '')
                    .replace('{{phone}}', patient.User?.phone || '')
                    .replace('{{address}}', patient.address || '')
                    .replace('{{cityOfBirth}}', patient.city_of_birth || '')
                    .replace('{{birthdate}}', patient.date_of_birth?.toISOString().split('T')[0] || '')
                    .replace('{{genderOptions}}', genderOptions)
                    .replace('{{bloodTypeOptions}}', bloodTypeOptions)
                    .replace('{{condition}}', patient.condition || '');

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(filled);
            }
        });
    }

    // --- Save edit changes ---
    else if (req.method === 'POST' && req.url === '/profile/edit') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            const params = new URLSearchParams(body);

            const patientUpdates = {
                first_name: params.get('firstname'),
                last_name: params.get('lastname'),
                address: params.get('address'),
                city_of_birth: params.get('city_of_birth'),
                date_of_birth: params.get('birthdate'),
                gender: params.get('gender'),
                blood_type: params.get('bloodType'),
                condition: params.get('condition')
            };

            const userUpdates = {
                email: params.get('email'),
                phone: params.get('phone')
            };

            await updatePatientByUserId(userId, patientUpdates);
            await User.update(userUpdates, { where: { id_user: userId } });

            res.writeHead(302, { Location: '/profile' });
            res.end();
        });
    }

    // --- Delete account ---
    else if (req.method === 'POST' && req.url === '/profile/delete') {
        await deletePatientByUserId(userId);
        await User.destroy({ where: { id_user: userId } });

        res.writeHead(302, {
            Location: '/signup',
            'Set-Cookie': 'userId=; HttpOnly; Path=/; Max-Age=0'
        });
        res.end();
    }
}

module.exports = { handleProfile };