const sequelize = require("./koneksi");
const DoctorController = require("./controllers/doctorController");
const categoryController = require("./controllers/categoryController");
const appointmentController = require("./controllers/appointmentController");
const recordController = require("./controllers/RecordController");
const patientController = require("./controllers/patientController");
const userController = require("./controllers/userController");
const querystring = require("querystring");
const auth = require("./auth");

let cur_user;
let cur_role;

sequelize.sync().then((result)=>{
    // console.log(result);
}).catch((err)=>{
    // console.log(err);
});
const http = require("http");
const fs = require("fs");
const path = require("path");
const { console } = require("inspector");

const server = http.createServer((req, res) => {
    console.log(req.method + " / " + req.url);
    const urlsplit = req.url.split("/");
    // KODE GREGORIUS WILLIAM LOGIN
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(302, { Location: '/login' });
        res.end();
    }
    else if (req.method === 'GET' && req.url === '/login') {
        fs.readFile(path.join(__dirname, "views", "login.html"), (err, data)=>{
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else{
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    // KODE WILL GREG POST LOGIN

    else if (req.method === 'POST' && req.url === '/login'){
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {  
            const formData = querystring.parse(body);
        let user;
        if (formData.loginType === 'username') {
                user = userController.findByUsername(formData.username);
            }

        else if (formData.loginType === 'email') {
                user =  userController.findByEmail(formData.email);
        }
        else if (formData.loginType === 'phone') {
                user = userController.findByPhone(formData.phone);
        }

        if (!user) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Invalid login type');
        }
        
            user.then(us=>{
                if (us && us.password === formData.password){
                    if(us.role === "patient"){
                        res.writeHead(302,
                        {'Location': '/home',
                        'Set-Cookie': `userId=${us.id_user}; HttpOnly; Path=/`
                        }
                    );  
                    res.end();

                    }else{
                        res.writeHead(302,
                        {'Location': '/homeadmin',
                        'Set-Cookie': `userId=${us.id_user}; HttpOnly; Path=/`
                        }
                    );  
                    res.end();
                    }
                    
                }

                else {
                fs.readFile(path.join(__dirname, "views", "login.html"), (err, html) => {
                    if (err) {
                        console.log("Gagal memanggil view");
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Gagal mengambil view");
                    } else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(html + '<p style="color:red;">Invalid username/email/phone or password</p>');
                    }
                });
            }
            });
         });
    }

    // KODE GREGORIUS WILLIAM GET SIGNUP
    else if (req.method === 'GET' && req.url === '/signup') {
        fs.readFile(path.join(__dirname, "views", "signup.html"), (err, data)=>{
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else{
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // KODE WILL GREG POST SIGNUP
    else if (req.method === 'POST' && req.url === '/signup') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on("end", ()=>{
            const formData = querystring.parse(body);
            if (formData.password !== formData.confirmPassword) {
                fs.readFile(path.join(__dirname, "views", "signup.html"), (err, data)=>{
                    if (err) {
                        console.log("Gagal memanggil view");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal mengambil view");
                    } 
                    else{
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data + '<p style="color:red;">Password did not match</p>');
                    }
                });
            }
            else{
                userController.findByUsername(formData.username).then(exists=>{
                    if(exists){
                        fs.readFile(path.join(__dirname, "views", "signup.html"), (err, data)=>{
                            if (err) {
                                console.log("Gagal memanggil view");
                                res.writeHead(500, {"Content-Type":"text/plain"});
                                res.end("Gagal mengambil view");
                            } 
                            else{
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(data + '<p style="color:red;">Username already exists. Please try another.</p>');
                            }
                        });
                    }
                    else {
                        
                        userController.createUserPatient(formData).then(apt =>{
                        res.writeHead(302, {"Location" : "/"});
                        res.end();
                    });

                    }
                });
                
            }

        });
    }

    // KODE WILLIAM GREG HOME
    else if (req.method === 'GET' && req.url === '/home') {
        auth.requireLogin(req, res, (userId) => {
            userController.findById(userId).then(user=>{
                if(user.role === "patient"){
                    fs.readFile(path.join(__dirname, "views", "home.html"), (err, data)=>{
                            if (err) {
                                console.log("Gagal memanggil view");
                                res.writeHead(500, {"Content-Type":"text/plain"});
                                res.end("Gagal mengambil view");
                            } 
                            else{
                                userController.findById(userId).then(user=>{
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    cur_role = user.role;
                                    res.end(data + user.role);
                                })
                                
                            }
                        });
                }
                else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/login"; 
        </script>`);
    }
            })
            
        });
    }

    else if (req.method === 'GET' && req.url === '/homeadmin') {
        auth.requireLogin(req, res, (userId) => {
            userController.findById(userId).then(user=>{
                if(user.role === "admin"){
                    fs.readFile(path.join(__dirname, "views", "homeadmin.html"), (err, data)=>{
                            if (err) {
                                console.log("Gagal memanggil view");
                                res.writeHead(500, {"Content-Type":"text/plain"});
                                res.end("Gagal mengambil view");
                            } 
                            else{
                                userController.findById(userId).then(user=>{
                                    res.writeHead(200, { 'Content-Type': 'text/html' });
                                    cur_role = user.role;
                                    res.end(data + user.role);
                                })
                                
                            }
                        });
                }
                else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/login"; 
        </script>`);
    }
            })
            
        });
    }
    // KODE WILLIAM GREG LOGOUT
    else if (req.method === 'GET' && req.url === '/logout') {
        res.writeHead(302, {
            'Location': '/login',
            'Set-Cookie': 'userId=; HttpOnly; Path=/; Max-Age=0'
        });
        res.end();
    }

    // KODE TAMPILAN DOKTER
    else if (req.url  === "/doctors" && req.method === "GET") {
auth.requireLogin(req, res, (userId) => {
    userController.findById(userId).then(user=>{
                if(user.role === "patient"){
        fs.readFile(path.join(__dirname, "views", "doctor.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                
                try{
                    
                   
                    DoctorController.getAllDoctor().then(doctors=>{
                        categoryController.getAllCategory().then(categories=>{
                            const html = data.toString().replace("<!--DOCTOR_DATA-->", JSON.stringify(doctors))
                            .replace("<!--CATEGORY_DATA-->", JSON.stringify(categories));
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        })
                    
                    });
                
                }
                catch(err){
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
        });
    }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
            });
        });
    }
    // KODE APPOINTMENT POST
    else if (req.url  === "/appointment" && req.method === "POST") {
auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "patient"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
            req.on("end", ()=>{
                const formData = querystring.parse(body);

                fs.readFile(path.join(__dirname, "views", "appointment.html"), (err, data) => {
                    if (err) {
                        console.log("Gagal memanggil view");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal melngambil view");
                    } 
                    else {
                        const cookies = auth.parseCookies(req);
                        const userId = cookies.userId;
                        patientController.getPatientByIdUser(userId).then(pt=>{
                         DoctorController.findDoctor(formData.id_doctor).then(doctors=>{
                            const html = data.toString().replace("<!--DOCTOR_DATA-->", JSON.stringify(doctors))
                            .replace("<!--PATIENT_DATA-->", JSON.stringify(pt));;
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        });
                    })

                        
                    }
                });
            });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
            });
        });
        
    }

    // KODE CREATE APPOINTMENT
    else if(req.url  === "/createappointment" && req.method === "POST"){
auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "patient"){

        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);
            console.log(body);
            if(!formData.id_doctor || !formData.id_patient || !formData.appointment_date ||!formData.appointment_time){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("Error: Semua harus diisi!");
            }

            try{
                appointmentController.createAppointment(formData).then(apt =>{
                    if (!apt) {  
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(`<script>
            alert("Antrian sudah penuh");
            window.location.href = "/appointmentlist"; 
        </script>`);
                    }else{
                        res.writeHead(302, {"Location" : "/appointmentlist"});
                        res.end();    
                    }
                    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
            });
  }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
            });
        
        });
    }

    // KODE GET APPOINTMENT LIST
    else if (req.url  === "/appointmentlist" && req.method === "GET") {
auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "patient"){

        fs.readFile(path.join(__dirname, "views", "appointmentList.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {

                try{
                    const cookies = auth.parseCookies(req);
                    const userId = cookies.userId;
                    patientController.getPatientByIdUser(userId).then(pt=>{
                        appointmentController.getAllSchedule(pt.id_patient).then(apt=>{
                        const html = data.toString().replace("<!--APPOINTMENT_DATA-->", JSON.stringify(apt));
                        res.writeHead(200, {"Content-Type":"text/html"});
                        res.write(html);
                    });
                    })
                    
             
                  
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
            });
 }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
            });
        });
        
    }
    // KODE DELETE APPOINTMENT
    else if (urlsplit[2] === "delete" && urlsplit[1] === "appointmentlist" && req.method === "GET") {
auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "patient"){
        
        const id = urlsplit[3]; 
        try{
                appointmentController.deleteSchedule(id).then(apt =>{
                    // console.log(apt);
                    res.writeHead(302, {"Location" : "/appointmentlist"});
                    res.end();
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
   }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
            });
        });

    }

    // KODE TAMPILAN MEDICAL RECORD
      else if (req.url  === "/medicalrecord" && req.method === "GET") {
auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "patient"){

        fs.readFile(path.join(__dirname, "views", "medicalRecord.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                
                try{
                    const cookies = auth.parseCookies(req);
                    const userId = cookies.userId;
                    patientController.getPatientByIdUser(userId).then(pt=>{
                      recordController.getAllRecord(pt.id_patient).then(apt=>{
                        const html = data.toString().replace("<!--RECORD_DATA-->", JSON.stringify(apt));
                        res.writeHead(200, {"Content-Type":"text/html"});
                        res.end(html);
                    });
                    })

                    
             
                  
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
            
            
        });
        
 }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
            });
        });

        
    }

    // KODE TAMPILAN CATEGORY
    else if(req.url  === "/admincategory" && req.method === "GET"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        fs.readFile(path.join(__dirname, "views/admin", "admincategory.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                try{    
                   categoryController.getAllCategory().then(categories=>{
                        const html = data.toString().replace("<!--CATEGORY_DATA-->", JSON.stringify(categories));
                        res.writeHead(200, {"Content-Type":"text/html"});
                        res.end(html);
                    });
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
        });
    }
    else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

    // KODE CREATE CATEGORY
    else if(req.url  === "/admincategory" && req.method === "POST"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
         let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);
            console.log(body);
            if(!formData.name){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("Error: Semua harus diisi!");
            }

            try{
                categoryController.createCategory(formData).then(apt =>{
                    // console.log(apt);
                    if (!apt) {  
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(`
             <script>
            alert("Category sudah ada");
            window.location.href = "/admincategory"; 
        </script>`);
                    }else{
                        res.writeHead(302, { Location: '/admincategory' });
                        res.end();    
                    }
                    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
         }
    else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }
     // KODE DELETE CATEGORY
    else if (urlsplit[2] === "delete" && urlsplit[1] === "admincategory" && req.method === "GET") {
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        const id = urlsplit[3]; 
        try{
                categoryController.deleteCategory(id).then(apt =>{
                    console.log(apt);
                    
                    if(apt === false){
                    res.writeHead(200,  { "Content-Type": "text/html"});

                        res.end(`
             <script>
            alert("Ada dokter dengan bidang ini");
            window.location.href = "/admincategory"; 
        </script>`);
                        
                    }
                    else{
                    res.writeHead(302, {"Location" : "/admincategory"});
                    res.end();

                    }
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

    // tampilkan admin appointment
    else if(req.url  === "/adminappointment" && req.method === "GET"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        fs.readFile(path.join(__dirname, "views/admin", "adminAppointment.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
                try{    
                        appointmentController.adminGetAllSchedule().then(apt=>{
                            const html = data.toString().replace("<!--APPOINTMENT_DATA-->", JSON.stringify(apt));
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        });
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
                    
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }
// update appointment
    else if(req.url  === "/adminappointment" && req.method === "POST"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);            
            try{
                appointmentController.updateStatus(formData).then(apt =>{
                    // console.log(apt);
                    
                        res.writeHead(302, {"Location" : "/adminappointment"});
                        res.end();    
                    
                    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
          }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }
     else if(req.url  === "/admindoctor" && req.method === "GET"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        fs.readFile(path.join(__dirname, "views/admin", "admindoctor.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
               try{
                    
                   
                    DoctorController.getAllDoctor().then(doctors=>{
                        categoryController.getAllCategory().then(categories=>{
                            const html = data.toString().replace("<!--DOCTOR_DATA-->", JSON.stringify(doctors))
                            .replace("<!--CATEGORY_DATA-->", JSON.stringify(categories));
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        })
                    
                    });
                
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

   // KODE CREATE APPOINTMENT
    else if(req.url  === "/admindoctor" && req.method === "POST"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);
            console.log(body);
            if(formData.category === "default" || !formData.first_name || !formData.last_name ||!formData.experience | !formData.gender ||!formData.degree){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("Error: Semua harus diisi!");
            }

            try{
                userController.createUserDoctor(formData).then(apt =>{
                    console.log(apt);
                    
                        res.writeHead(302, {"Location" : "/admindoctor"});
                        res.end();    
                    
                    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

    // update admindoctor
    else if(req.url  === "/updateadmindoctor" && req.method === "POST"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);            
            try{
                DoctorController.updateDoctor(formData).then(apt =>{
                        res.writeHead(302, {"Location" : "/admindoctor"});
                        res.end();    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

    // delete admin doctor

     else if (urlsplit[2] === "delete" && urlsplit[1] === "admindoctor" && req.method === "GET") {
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        const id = urlsplit[3]; 
        try{
                DoctorController.deleteDoctor(id).then(apt =>{
                    // console.log(apt);
                    if(apt === false){
                    res.writeHead(200,  { "Content-Type": "text/html"});

                        res.end(`
             <script>
            alert("Dokter masih aktif");
            window.location.href = "/admindoctor"; 
        </script>`);
                        
                    }
                    else{
                    res.writeHead(302, {"Location" : "/admindoctor"});
                    res.end();

                    }
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
            }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }
// tampilan adminpatient
 else if(req.url  === "/adminpatient" && req.method === "GET"){
    auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        fs.readFile(path.join(__dirname, "views/admin", "adminpatient.html"), (err, data) => {
            if (err) {
                console.log("Gagal memanggil view");
                res.writeHead(500, {"Content-Type":"text/plain"});
                res.end("Gagal mengambil view");
            } 
            else {
               try{
                    
                   
                    patientController.getAllPatient().then(pt=>{
                            const html = data.toString().replace("<!--PATIENT_DATA-->", JSON.stringify(pt))
                            res.writeHead(200, {"Content-Type":"text/html"});
                            res.end(html);
                        })
                    
                
                }
                catch(err){
                    console.log("Gagal memanggil data");
                    res.writeHead(500, {"Content-Type":"text/plain"});
                    res.end("Gagal mengambil data");
                }
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

     // KODE CREATE adminpatient
    else if(req.url  === "/adminpatient" && req.method === "POST"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);
            console.log(body);
            if(!formData.city_of_birth || !formData.date_of_birth || !formData.address ||  !formData.first_name || !formData.last_name  | !formData.gender || !formData.blood_type || !formData.condition){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("Error: Semua harus diisi!");
            }

            try{
                userController.createUserPatient(formData).then(apt =>{
                    console.log(apt);
                    
                        res.writeHead(302, {"Location" : "/adminpatient"});
                        res.end();    
                    
                    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

    // update admin patient
     else if(req.url  === "/updateadminpatient" && req.method === "POST"){
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        let body = "";
            req.on("data", chunk => {
                body += chunk.toString();
            });
        req.on("end", ()=>{
            const formData = querystring.parse(body);
            if(!formData.city_of_birth || !formData.date_of_birth || !formData.address ||  !formData.first_name || !formData.last_name  || !formData.gender || !formData.blood_type || !formData.condition){
                res.writeHead(400, {"Content-Type": "text/plain"});
                return res.end("Error: Semua harus diisi!");
            }            
            try{
                patientController.updatePatient(formData.id_patient, formData).then(apt =>{
                        res.writeHead(302, {"Location" : "/adminpatient"});
                        res.end();    
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
        });
        }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

    // delete adminpatient
       else if (urlsplit[2] === "delete" && urlsplit[1] === "adminpatient" && req.method === "GET") {
        auth.requireLogin(req, res, (userId) => {
userController.findById(userId).then(user=>{
                if(user.role === "admin"){
        const id = urlsplit[3]; 
        try{
                patientController.deletePatient(id).then(apt =>{
                    if(apt === false){
                    res.writeHead(200,  { "Content-Type": "text/html"});

                        res.end(`
             <script>
            alert("Pasien masih aktif");
            window.location.href = "/adminpatient"; 
        </script>`);
                        
                    }
                    else{
                    res.writeHead(302, {"Location" : "/adminpatient"});
                    res.end();

                    }
                });
                
            }
            catch(err){
                    console.log("Gagal memasukkan data");
                        res.writeHead(500, {"Content-Type":"text/plain"});
                        res.end("Gagal memasukkan data");
            }
            }
        else{
        res.writeHead(403, { "Content-Type": "text/html"});
        res.end(`
             <script>
            alert("Anda tidak memiliki akses");
            window.location.href = "/"; 
        </script>`);
    }
});
        });
    }

});


server.listen(3000, ()=> {
    console.log("server berhalan di http://localhost:3000");
});
