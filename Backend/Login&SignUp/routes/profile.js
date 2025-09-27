// routes/profile.js
const fs = require('fs');
const path = require('path');

const { getPatientById, updatePatient, deletePatient } = require('./patientService');

const VIEWS_DIR = path.join(__dirname, '..', 'views');
const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'patients.json');

// helper to read patient data
function loadData() {
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

// helper to save patient data
function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

async function handleProfile(req, res, userId) {
    const data = loadData();
    
    // --- Fetch user from Sequelize (preferred) ---
    let user = await getPatientById(userId);

    // fallback to JSON if not found in DB
    if (!user) {
        user = data.find(u => u.id === userId);
    }

    if (!user) {
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
                let filled = content
                    .replace('{{firstname}}', user.firstname)
                    .replace('{{lastname}}', user.lastname)
                    .replace('{{email}}', user.email)
                    .replace('{{phone}}', user.phone)
                    .replace('{{address}}', user.address)
                    .replace('{{birthdate}}', user.birthdate)
                    .replace('{{gender}}', user.gender)
                    .replace('{{bloodType}}', user.bloodType);

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
                    <option value="Male" ${user.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${user.gender === 'Female' ? 'selected' : ''}>Female</option>
                `;

                let bloodTypeOptions = `
                    <option value="A+" ${user.bloodType === 'A+' ? 'selected' : ''}>A+</option>
                    <option value="A-" ${user.bloodType === 'A-' ? 'selected' : ''}>A-</option>
                    <option value="B+" ${user.bloodType === 'B+' ? 'selected' : ''}>B+</option>
                    <option value="B-" ${user.bloodType === 'B-' ? 'selected' : ''}>B-</option>
                    <option value="AB+" ${user.bloodType === 'AB+' ? 'selected' : ''}>AB+</option>
                    <option value="AB-" ${user.bloodType === 'AB-' ? 'selected' : ''}>AB-</option>
                    <option value="O+" ${user.bloodType === 'O+' ? 'selected' : ''}>O+</option>
                    <option value="O-" ${user.bloodType === 'O-' ? 'selected' : ''}>O-</option>
                `;

                let filled = content
                    .replace('{{firstname}}', user.firstname)
                    .replace('{{lastname}}', user.lastname)
                    .replace('{{email}}', user.email)
                    .replace('{{phone}}', user.phone)
                    .replace('{{address}}', user.address)
                    .replace('{{birthdate}}', user.birthdate)
                    .replace('{{genderOptions}}', genderOptions)   // 👈 add this
                    .replace('{{bloodTypeOptions}}', bloodTypeOptions); // 👈 and this

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

            const idx = data.findIndex(u => u.id === userId);
            if (idx === -1) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User not found');
                return;
            }

            // update fields
            if (idx !== -1) {
                data[idx].firstname = params.get('firstname');
                data[idx].lastname = params.get('lastname');
                data[idx].email = params.get('email');
                data[idx].phone = params.get('phone');
                data[idx].address = params.get('address');
                data[idx].birthdate = params.get('birthdate');
                data[idx].gender = params.get('gender');
                data[idx].bloodType = params.get('bloodType');
                saveData(data);
            }

            // update fields (Sequelize)
            await updatePatient(userId, {
                firstname: params.get('firstname'),
                lastname: params.get('lastname'),
                email: params.get('email'),
                phone: params.get('phone'),
                address: params.get('address'),
                birthdate: params.get('birthdate'),
                gender: params.get('gender'),
                bloodType: params.get('bloodType')
            });

            res.writeHead(302, { Location: '/profile' });
            res.end();
        });
    }

    // --- Delete account ---
    else if (req.method === 'POST' && req.url === '/profile/delete') {
        const updated = data.filter(u => u.id !== userId);
        saveData(updated);

        // delete from Sequelize
        await deletePatient(userId);

        res.writeHead(302, {
            Location: '/signup',
            'Set-Cookie': 'userId=; HttpOnly; Path=/; Max-Age=0'
        });
        res.end();
    }
}

module.exports = { handleProfile };