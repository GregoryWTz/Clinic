// If you want to run node or nodemon server.js, make sure to {npm install sequelize mysql2} first.
// Then create database "dbclinic" in your MySQL server (e.g., using phpMyAdmin or MySQL CLI).
// also make sure your MySQL server is running (e.g., Laragon, XAMPP, etc.)

const http = require('http');
const fs = require('fs');
const path = require('path');
const { requireLogin } = require('./auth');
const { handleProfile } = require('./controller/profileController');
const sequelize = require('./db/db');
const User = require('./models/Users');
const Patient = require('./models/Patient');

const VIEWS_DIR = path.join(__dirname, 'views');

// make sure table exists
sequelize.sync();

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(302, { Location: '/login' });
        res.end();
    }

    else if (req.method === 'GET' && req.url === '/login') {
        // tampilkan login.html
        fs.readFile(path.join(VIEWS_DIR, 'login.html'), 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading login page');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }  
        });
    }

    else if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            // parse body (username & password)
            const params = new URLSearchParams(body);
            const loginType = params.get('loginType');
            const username = params.get('username');
            const email = params.get('email');
            const phone = params.get('phone');
            const password = params.get('password');

            try {
                let user = null;

                if (loginType === 'username') {
                    user = await User.findOne({ where: { username, password } });
                } else if (loginType === 'email') {
                    user = await User.findOne({ where: { email, password } });
                } else if (loginType === 'phone') {
                    user = await User.findOne({ where: { phone, password } });
                }

                if (user) {
                    console.log('Login user:', user.toJSON ? user.toJSON() : user);
                    res.writeHead(302, {
                        Location: '/home',
                        'Set-Cookie': `userId=${user.id_user}; HttpOnly; Path=/`
                    });
                    res.end();
                } else {
                    fs.readFile(path.join(VIEWS_DIR, 'login.html'), 'utf-8', (err, loginContent) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error loading login page');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(loginContent + '<p style="color:red;">Invalid credentials</p>');
                        }
                    });
                }
            } catch (err) {
                console.error("Login error:", err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error during login');
            }
        });
    }

    else if (req.method === 'GET' && req.url === '/signup') { 
        // tampilkan signup.html
        fs.readFile(path.join(VIEWS_DIR, 'signup.html'), 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading signup page');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    }

    else if (req.method === 'POST' && req.url === '/signup') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const params = new URLSearchParams(body);
            const firstname = params.get('firstname');
            const lastname = params.get('lastname');
            const username = params.get('username');
            const password = params.get('password');
            const confirmPassword = params.get('confirmPassword');
            const email = params.get('email');
            const phone = params.get('phone');
            const cityOfBirth = params.get('city_of_birth');
            const address = params.get('address');
            const birthdate = params.get('birthdate');
            const gender = params.get('gender');
            const bloodType = params.get('bloodtype');
            let condition = params.get('condition');

            if (password !== confirmPassword) {
                fs.readFile(path.join(VIEWS_DIR, 'signup.html'), 'utf-8', (err, loginContent) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error loading login page');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(loginContent + '<p style="color:red;">Password did not match</p>');
                    }
                });
            } else {
                try {
                    // check if username already exists
                    let exists = await User.findOne({ where: { username } });
                    if (exists) {
                        fs.readFile(path.join(VIEWS_DIR, 'signup.html'), 'utf-8', (err, signupContent) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Error loading signup page');
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(signupContent + '<p style="color:red;">Username already exists. Please try another.</p>');
                            }
                        });
                    } else {
                        let emailExists = await User.findOne({ where: { email } });
                        if (emailExists) {
                            // show error in signup form
                            fs.readFile(path.join(VIEWS_DIR, 'signup.html'), 'utf-8', (err, signupContent) => {
                                if (err) {
                                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                                    res.end('Error loading signup page');
                                } else {
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    res.end(signupContent + '<p style="color:red;">Email already exists. Please use another.</p>');
                                }
                            });
                        } else {
                            if (!condition) {
                                condition = ('Tidak ada');
                            }

                            const newUser = await User.create({
                                id_user: "U" + Date.now(), // simple unique id, or use UUID
                                username,
                                password,
                                email,
                                phone,
                                role: "patient"
                            });

                            // 2️⃣ Generate Patient ID
                            let lastPatient = await Patient.findOne({ order: [['id_patient', 'DESC']] });
                            let newIdNumber = 1;
                            if (lastPatient) {
                                let lastIdNum = parseInt(lastPatient.id_patient.replace("PS", ""));
                                newIdNumber = lastIdNum + 1;
                            }
                            let newPatientId = "PS" + String(newIdNumber).padStart(3, "0");

                            // 3️⃣ Create Patient linked to User
                            await Patient.create({
                                id_patient: newPatientId,
                                id_user: newUser.id_user,   // foreign key
                                first_name: firstname,
                                last_name: lastname,
                                gender: gender,
                                city_of_birth: cityOfBirth,
                                date_of_birth: birthdate,
                                blood_type: bloodType,
                                address: address,
                                condition: null,
                                created_at: new Date(),
                                last_updated_at: new Date(),
                                condition: condition
                            });

                            res.writeHead(302, { Location: '/' });
                            res.end();
                        }
                    }
                } catch (err) {
                    console.error("Signup error:", err);

                    fs.readFile(path.join(VIEWS_DIR, 'signup.html'), 'utf-8', (fileErr, signupContent) => {
                        if (fileErr) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Error loading signup page');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(signupContent + '<p style="color:red;">Error saving user in database</p>');
                        }
                    });
                }
            }
        });
    }
    
    else if (req.method === 'GET' && req.url === '/logout') {
        res.writeHead(302, {
            'Location': '/login',
            'Set-Cookie': 'userId=; HttpOnly; Path=/; Max-Age=0'
        });
        res.end();
    }

    else if (req.method === 'GET' && req.url === '/home') {
        requireLogin(req, res, (userId) => {
            fs.readFile(path.join(VIEWS_DIR, 'home.html'), 'utf-8', (err, content) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error loading home page');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content);
                }
            });
        });
    }

    else if (req.url.startsWith('/profile')) {
        requireLogin(req, res, (userId) => {
            handleProfile(req, res, userId);
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});