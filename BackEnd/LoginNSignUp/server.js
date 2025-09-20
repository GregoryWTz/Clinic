const http = require('http'); // untuk membuat server HTTP
const fs = require('fs'); // untuk membaca dan menulis file
const querystring = require('querystring'); // untuk parsing data dari form

const DATA_FILE = 'patients.json';

// fungsi baca data dari file
function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]');
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        // ambil index.html
        fs.readFile('login.html', 'utf-8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading file');
            } else {
                // login page
                let data = loadData();

                // checking if user is logged in
                // if yes, bring to home page
                // if not, immidiately show login page
                // this is where it checks user inputs if it matches the data in patients.json
            }
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
        });
    }

    else if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            // parse body (username & password)
            const params = new URLSearchParams(body);
            const loginType = params.get('loginType');
            const username = params.get('username');
            const email = params.get('email');
            const phone = params.get('phone');
            const password = params.get('password');

            let user = null;
            let data = loadData();
            if (loginType === 'username') {
                user = data.find(u => u.username === username && u.password === password);
            }
            else if (loginType === 'email') {
                user = data.find(u => u.email === email && u.password === password);
            }
            else if (loginType === 'phone') {
                user = data.find(u => u.phone === phone && u.password === password);
            }
            
            if (user) {
                // login success → load home.html
                fs.readFile('home.html', 'utf-8', (err, homeContent) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error loading home page');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(homeContent);
                    }
                });
            } else {
                // login fail → reload login.html + error
                fs.readFile('login.html', 'utf-8', (err, loginContent) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Error loading login page');
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(loginContent + '<p style="color:red;">Invalid username or password</p>');
                    }
                });
            }
        });
    }

    else if (req.method === 'GET' && req.url === '/signup') { 
        // tampilkan signup.html
        fs.readFile('signup.html', 'utf-8', (err, content) => {
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

        req.on('end', () => {
            const params = new URLSearchParams(body);
            const username = params.get('username');
            const password = params.get('password');
            const email = params.get('email');
            const phone = params.get('phone');
            const birthdate = params.get('birthdate');

            let data = loadData();

            // check if username already exists
            let exists = data.find(u => u.username === username);
            if (exists) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('<p style="color:red;">Username already exists. Please try another.</p>');
                return;
            }

            // add new user
            let newUser = { username, password, email, phone, birthdate };
            data.push(newUser);

            fs.writeFile('patients.json', JSON.stringify(data, null, 2), (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error saving user');
                } else {
                    res.writeHead(302, { Location: '/' });
                    res.end();
                }
            });
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
